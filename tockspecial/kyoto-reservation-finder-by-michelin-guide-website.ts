import { simpleFetchGet } from "yumutil";
import fs from "fs";
import { load as cheerioLoad } from "cheerio";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Browser, Handler, Page, executablePath } from "puppeteer"


// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import * as pp from "puppeteer";

puppeteer.use(StealthPlugin());

dayjs.extend(utc);
dayjs.extend(timezone);

const kyotoList = JSON.parse(fs.readFileSync("kyoto.json", "utf8"));
const CACHE_FILE = "kyoto-reservation-cache.json";

type ReservationCache = Record<string, string | null>;

let reservationCache: ReservationCache = {};

try {
  if (fs.existsSync(CACHE_FILE)) {
    reservationCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  }
} catch (err) {
  console.warn(`Failed to load cache from ${CACHE_FILE}:`, err);
  reservationCache = {};
}

function persistCache() {
  try {
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify(reservationCache, null, 2),
      "utf8"
    );
  } catch (err) {
    console.warn(`Failed to write cache to ${CACHE_FILE}:`, err);
  }
}

async function findReservationLinkByUrl(url: string) {
  if (Object.prototype.hasOwnProperty.call(reservationCache, url)) {
    return reservationCache[url];
  }

  const body = await simpleFetchGet(url);
  const $ = cheerioLoad(body);
  const link = $('a[data-event="partner_book"]').attr("href");
  const normalizedLink = link ? link : null;

  reservationCache[url] = normalizedLink;
  persistCache();

  return normalizedLink;
}

function tablecheckSlugFromUrl(url: string) {
  const pattern = /.*\/([^\/]+)\/reserve/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function buildOmakaseUrls(
  reservationUrl: string,
  inquiryDate: string,
  guestsCount: number
): { landingUrl: string; inquiryUrl: string } {
  const baseUrl = new URL(reservationUrl);
  baseUrl.search = "";
  baseUrl.hash = "";

  const cleanPath = baseUrl.pathname.replace(/\/$/, "");
  const landingUrl = `${baseUrl.origin}${cleanPath}`;

  const inquiryPath = `${cleanPath}/inquire`;
  const inquiryUrl = new URL(inquiryPath, baseUrl.origin);
  inquiryUrl.searchParams.set("date", inquiryDate);
  inquiryUrl.searchParams.set("guests_count", guestsCount.toString());

  return {
    landingUrl,
    inquiryUrl: inquiryUrl.toString(),
  };
}
function convertSecondsSinceMidnightToJapanTime(
  startdate: string,
  seconds: number
): string {
  const baseDate = dayjs.tz(startdate, "Asia/Tokyo").startOf("day");
  const japanTime = baseDate.add(seconds, "second");
  return japanTime.format("YYYY-MM-DDTHH:mm:00.000+09:00");
}
async function scrapeOmakaseInquiry(
  reservationUrl: string,
  inquiryDate: string,
  guestsCount: number
): Promise<string[]> {
  const { landingUrl, inquiryUrl } = buildOmakaseUrls(
    reservationUrl,
    inquiryDate,
    guestsCount
  );

  // const browser = await puppeteer.launch({ headless: true });
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  }).catch(error => {
    console.error('Failed to launch browser:', error);
    throw error;
  });

  try {
    const page = await browser.newPage();
    await page.goto(landingUrl, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.goto(inquiryUrl, { waitUntil: "networkidle2" });

    await page.waitForSelector("body", { timeout: 10000 });

    const bodyText = await page.content();
    const $ = cheerioLoad(bodyText);
    const body = $("body").text();

    const responseJson = JSON.parse(body);
    const slots = [];
    // console.log(responseJson);

    if (responseJson?.time_slots) {
      for (const timeslot of responseJson.time_slots) {
        const seconds_since_midnight = timeslot.seconds_since_midnight;
        const japanTime = convertSecondsSinceMidnightToJapanTime(
          inquiryDate,
          seconds_since_midnight
        );
        slots.push(japanTime);
      }
    }

    return slots;
  } finally {
    await browser.close();
  }
}

async function findAvailableSlotsTablecheck(
  tablecheckUrl: string,
  date: string,
  numPeople: number
) {
  const slug = tablecheckSlugFromUrl(tablecheckUrl);
  console.log(`slug: ${slug}`);

  const myHeaders = new Headers();

  myHeaders.append("Accept", "application/json, text/plain, */*");
  myHeaders.append("Accept-Language", "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Origin", "https://www.tablecheck.com");
  myHeaders.append("Referer", "https://www.tablecheck.com/");
  myHeaders.append("Sec-Fetch-Dest", "empty");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Sec-Fetch-Site", "same-site");
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
  );

  myHeaders.append(
    "sec-ch-ua",
    '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"'
  );
  myHeaders.append("sec-ch-ua-mobile", "?0");
  myHeaders.append("sec-ch-ua-platform", '"macOS"');
  myHeaders.append("Cookie", "request_method=POST");

  const raw = JSON.stringify({
    shop_id: slug,
    date: `${date}T12:00:00.000+09:00`,
    bookable_menu_item_ids: [],
    bookable_menu_list_ids: [],
    voucher_ids: [],
    menu_item_ids: [],
    pax_adult: numPeople,
    pax_senior: 0,
    pax_child: 0,
    pax_baby: 0,
    locale: "ja",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://production-booking.tablecheck.com/v2/booking/meals_v2",
    requestOptions as RequestInit
  );

  const body = await response.text();
  const json = JSON.parse(body);
  console.log(JSON.stringify(json, null, 2));

  const slots = [];
  if (json?.meals) {
    if (json.meals.lunch) {
      for (const lunch of json.meals.lunch) {
        if (lunch && lunch.a && lunch.t) {
          // t is in the format of "2025-11-28T12:00:00Z" , which is in GMT timezone
          // we need to convert it to the local timezone in Japan
          const japanTime = convertGMTToJapanTime(lunch.t);
          slots.push(japanTime);
        }
      }
    }
    if (json.meals.dinner) {
      for (const dinner of json.meals.dinner) {
        if (dinner && dinner.a && dinner.t) {
          // t is in the format of "2025-11-28T12:00:00Z" , which is in GMT timezone
          // we need to convert it to the local timezone in Japan
          const japanTime = convertGMTToJapanTime(dinner.t);
          slots.push(japanTime);
        }
      }
    }
  }
  return slots;
}

function convertGMTToJapanTime(t: string) {
  const japanTime = dayjs.tz(t, "GMT").tz("Asia/Tokyo");
  return japanTime.format("YYYY-MM-DDTHH:mm:00.000+09:00");
}

(async function main() {
  const date = process.argv[2] || dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");
  const numPeople = 2;
  try {
    // const restaurants = kyotoList.filter(
    //   (v: { name: string }) => v.name === "Kenya"
    // );
    const restaurants = kyotoList;
    for (let v of restaurants) {
      try {
        const url = `https://guide.michelin.com${v.url}`;
        const reservation_link = await findReservationLinkByUrl(url);
        console.log(`${v.name} (${v.michelin_award}) ${reservation_link}`);

        if (!reservation_link) {
          console.log("no reservation links found");
          continue;
        }
        var slots: string[] = [];
        if (reservation_link.includes("tablecheck")) {
          // slots = await findAvailableSlotsTablecheck(
          //   reservation_link,
          //   date,
          //   numPeople
          // );
        } else if (reservation_link.includes("omakaseje")) {
          slots = await scrapeOmakaseInquiry(reservation_link, date, numPeople);
        }
        if (slots.length > 0) {
          console.log(`${v.name}: ${reservation_link}`);
          console.log(JSON.stringify(slots, null, 2));
        }
      } catch (error) {
        console.error(error);
      }
      console.log(`--------------------------------`);
    }
  } catch (error) {
    console.error(error);
  }
})();
