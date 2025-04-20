import {
  resy_calendar_key,
  resyLists,
  resy_day_key,
  saveToRedisWithChunking,
  getRedis,
  resyFindReservation,
} from "yumutil";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { HTTPResponse, HTTPRequest, Browser, Page } from "puppeteer";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

puppeteer.use(StealthPlugin());

const redis = getRedis();


const response_processing = async (response: HTTPResponse): Promise<void> => {
  if (response.url().includes("https://api.resy.com/4/find")) {
    const status = response.status();
    if (status === 200) {
      try {
        console.log("<<", status, response.url());
        const text = await response.text();
        const json = JSON.parse(text);
        // console.log(text.slice(0, 220));
        // console.log(JSON.stringify(json, null, 2));
        const venue = json.results.venues[0].venue;
        const slug = venue.url_slug;
        const timezone = venue.location.time_zone;
        const query = json.query;
        // console.log(slug, query);
        const total: any[] = [];
        if (json.results.venues[0]) {
          const slots = json.results.venues[0].slots;
          slots.forEach(function (slot: any) {
            // let datestr = dayjs.tz(slot.date.start, timezone).format();
            // total.push(datestr);
            let datestr = slot.date.start;
            total.push(datestr);
          });
        }
        console.log(`Saving ${total.length} slots for ${slug} ${query.day} ${query.party_size}`);
        const redisk_key = resy_day_key(slug, query.day, query.party_size);
        await redis.set(redisk_key, JSON.stringify(total));
      } catch (error) {
        console.error(error);
      }
    } else {
      // console.log("<<", response.url());
    }
  };
}

const request_processing = (request: HTTPRequest): void => {
  // console.log(">>", request.method(), request.url());
  request.continue();
};

let scrapingBrowser: Browser | null = null;
let scrapingPage: Page | null = null;
async function getBrowserPageSingleton() {
  if (!scrapingPage) {
    // if (scrapingBrowser) {
    //   await scrapingBrowser!.close();
    // }
    console.log("launching new browser");
    scrapingBrowser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    }).catch(error => {
      console.error('Failed to launch browser:', error);
      throw error;
    });
    const page = await scrapingBrowser.newPage();
    await page.setRequestInterception(true);
    page.on("response", response_processing);
    page.on("request", request_processing);
    scrapingPage = page;
  }
  return scrapingPage;
}

(async function main() {

  const partySizeArg = process.argv[2];
  const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

  if (isNaN(party_size) || party_size < 1) {
    console.error("Please provide a valid numeric value for party size.");
    process.exit(1);
  }
  try {
    console.log('Launching browser...');

    console.log('Browser launched successfully');
    const resy_full_list = await resyLists();

    // Build map with slug as key for easy lookup
    const resySlugMap = resy_full_list.reduce((acc: Record<string, any>, venue: any) => {
      acc[venue.urlSlug] = venue;
      return acc;
    }, {});

    // const l = rl.filter((v) => v.name == "AltoVino"); 
    // const workingList = resy_full_list.slice(0, 5);
    // const workingList = resy_full_list.slice(0, 1);
    // const workingList = resy_full_list.filter((v: any) => v.name.startsWith("Aza"));
    const workingList = [...resy_full_list].sort(() => Math.random() - 0.5);

    const keys = workingList.map((v: any) => resy_calendar_key(v.urlSlug, party_size));

    // keys in the form of
    // [
    //   "resy-calendar-rich-table-2",
    //   "resy-calendar-the-morris-2",
    //   "resy-calendar-outerlands-2",
    //   "resy-calendar-mama-2",
    //   "resy-calendar-iyasare-2",
    // ];

    const data = await redis.mget(keys);
    // data is an array of objects in the form of
    //
    // [
    //  {
    //   "scheduled": [
    //             {
    //     "date": "2025-05-10",
    //     "inventory": {
    //       "reservation": "available",
    //       "event": "not available",
    //       "walk-in": "available"
    //     }
    //   }
    //  ...
    //   ],
    //  }
    // ]

    // console.log(JSON.stringify(data, null, 2));
    const noavail: any[] = [];
    const avail: any[] = [];

    for (let i = 0; i < workingList.length; i++) {
      // console.log(l[i].urlSlug, l[i].name);
      const entry: any = data[i];
      // eslint-disable-next-line array-callback-return
      entry?.scheduled?.map((entry: any) => {
        if (!workingList[i].urlSlug) {
          console.log(workingList[i], "is null  xxxxxxxxxxxxxx");
          return null;
        }
        if (entry.inventory.reservation !== "available") {
          noavail.push({
            slug: workingList[i].urlSlug,
            venue_id: workingList[i].businessid,
            party_size: party_size,
            date: entry.date,
            note: entry.inventory.reservation,
          });
        } else {
          avail.push({
            slug: workingList[i].urlSlug,
            venue_id: workingList[i].businessid,
            party_size: party_size,
            date: entry.date,
          });
        }
      });
    }

    const noavailmap: Record<string, any[]> = {};
    // eslint-disable-next-line array-callback-return
    noavail.map((item) => {
      const key = resy_day_key(item.slug, item.date, item.party_size);
      noavailmap[key] = [];
    });

    console.log("These dates have no availability, saving first into Redis");
    console.log(JSON.stringify(noavailmap, null, 2));

    await saveToRedisWithChunking(noavailmap, `no availabilites`);

    // Group the 'avail' array by the 'date' field
    const groupedAvail = avail.reduce((acc: Record<string, any[]>, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    // console.log("These have availability");
    // console.log(JSON.stringify(groupedAvail, null, 2));

    const dates = Object.keys(groupedAvail).sort();
    // console.log("dates as keys");
    console.log(dates);

    for (const k of dates) {
      console.log(groupedAvail[k]);
    }


    for (const k of dates) {
      let bool_transport_error = false;
      const answers: Record<string, any> = {};
      try {
        const randomized_avail = [...groupedAvail[k]].sort(() => Math.random() - 0.5);
        for (const e of randomized_avail) {
          console.log(
            `finding reservation for ${e.slug} ${e.date} ${e.party_size}`
          );

          // GlobalResults[slug] = null;
          const citycode = resySlugMap[e.slug].resyCityCode;
          const resy_url = `https://resy.com/cities/${citycode}/venues/${e.slug}?date=${e.date}&seats=${e.party_size}`;

          const page = await getBrowserPageSingleton();
          console.log(`going to ${resy_url}`);
          try {
            await page.goto(resy_url);
          } catch (e) {
            console.log("Problem going to ", resy_url);
            console.log(e);
            console.log("continuing --------------------");
            scrapingPage = null;
          }

          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error(error);
        console.log(
          `catching error here but continue save the results so far for ${k}`
        );
      }

      console.log(`Saving answers for ${k}`);
      await saveToRedisWithChunking(answers, `party of ${k}`);
      if (bool_transport_error) {
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
