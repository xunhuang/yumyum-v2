import { yumyumGraphQLCall, resy_set_venue_to_tbd } from "yumutil";
import { saveToRedisWithChunking } from "yumutil";
import dayjs from "dayjs";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { HTTPResponse, HTTPRequest } from "puppeteer";

puppeteer.use(StealthPlugin());

interface Venue {
  name: string;
  urlSlug: string;
  key: string;
}

interface CalendarResult {
  ticketGroupByBusinessDay: Record<string, any>;
  ticketType: any[];
  ticketTypePackage: any[];
  packagedTicketType: any[];
}

interface GlobalResultsType {
  [key: string]: string | null;
}

interface GlobalSlugMapType {
  [key: string]: Venue;
}

let GlobalResults: GlobalResultsType = {};
let GlobalSlugMap: GlobalSlugMapType = {};

async function tockDbData(): Promise<Venue[]> {
  const query = `
    query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}, reservation: {equalTo: "tock"}, close: {equalTo: false}}
  ) {
nodes {
        name
        urlSlug
        key
      }
  }
}`;
  const json = await yumyumGraphQLCall(query);

  const nodes: Venue[] = json.data.allVenues.nodes;
  return nodes;
}

const response_processing = async (response: HTTPResponse): Promise<void> => {
  if (response.url().includes("calendar")) {
    const status = response.status();
    console.log("<<", status, response.url());
    const requestheader = response.request().headers();
    const lastPath = requestheader["x-tock-path"];
    const slug = lastPath.split("/")[1];

    if (status !== 200) {
      console.log("XXX status !=200 problem reading response for ", lastPath);
      return;
    }

    try {
      const text = await response.text();
      console.log(text.slice(0, 220));
      GlobalResults[slug] = text;

      const calendar: { result: CalendarResult } = JSON.parse(GlobalResults[slug]!);

      if (
        calendar &&
        (Object.keys(calendar.result.ticketGroupByBusinessDay).length > 0 ||
          calendar.result.ticketType.length > 0 ||
          calendar.result.ticketTypePackage.length > 0 ||
          calendar.result.packagedTicketType.length > 0)
      ) {
        await saveToRedis(slug, calendar);
      } else {
        console.log(
          "XXX no legit calendar for ",
          slug,
          lastPath,
          response.url()
        );
        resy_set_venue_to_tbd(GlobalSlugMap[slug].key);
      }
    } catch (e) {
      console.log("XXX problem reading response for ", lastPath);
      console.log(requestheader);
      console.log(e);
    }
  }
};

const request_processing = (request: HTTPRequest): void => {
  if (request.url().includes("calendar")) {
    console.log(">>", request.method(), request.url());
    const requestParams: any = {
      method: request.method(),
      postData: request.postData(),
      headers: {
        ...request.headers(),
        accept: "application/json",
      }
    };
    request.continue(requestParams);
    return;
  }
  request.continue();
};

(async function main(): Promise<void> {
  try {
    const tockdata = await tockDbData();
    const BayAreaSlugs = tockdata.map((v) => v.urlSlug);

    GlobalSlugMap = tockdata.reduce((acc: GlobalSlugMapType, element: Venue) => {
      acc[element.urlSlug] = element;
      return acc;
    }, {});

    await scrapeTockList(BayAreaSlugs);
    console.log("all done - saving to redis may continue before exiting");
  } catch (error) {
    console.error(error);
  }
})();

async function saveToRedis(slug: string, calendar: { result: CalendarResult }): Promise<void> {
  const result: Record<string, string> = {};
  for (const d in calendar.result.ticketGroupByBusinessDay) {
    if (calendar.result.ticketGroupByBusinessDay[d].ticketGroupByDate[d]) {
      result[`${slug}-${d}`] = JSON.stringify(
        calendar.result.ticketGroupByBusinessDay[d].ticketGroupByDate[d]
          .ticketGroup
      );
    }
  }
  await saveToRedisWithChunking(result, slug);
}

async function scrapeTockList(slugsList: string[]): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  for (let i = 0; i < slugsList.length && i < 2000; i++) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", request_processing);
    page.on("response", response_processing);

    const slug = slugsList[i];
    GlobalResults[slug] = null;
    const date = dayjs().format("YYYY-MM-DD");
    const url = `https://www.exploretock.com/${slug}/search?date=${date}&size=2&time=20%3A00`;

    console.log(`going to ${url}`);
    try {
      await page.goto(url);
    } catch (e) {
      console.log("Problem going to ", url);
      console.log(e);
      console.log("continuing --------------------");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log("done with scraping");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await browser.close();
}
