import * as cheerio from 'cheerio';
import puppeteer from "puppeteer-extra";
import { Page, executablePath } from "puppeteer";
import dayjs from "dayjs";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { deserializeTockSearchResponseProtoToMsg, newTockSearchRequest, serializeMsgToProto } from "./tockRequestMsg";
import { addressMatch } from "./utils";
puppeteer.use(StealthPlugin());

var browserPage: Page;
async function getBrowerPageSingleton(): Promise<Page> {
  if (!browserPage) {
    const browser = await puppeteer.launch({
      executablePath: executablePath(),
      // headless: false,
      headless: true,
    });
    const page = await browser.newPage();
    const url = `https://www.exploretock.com`;
    await page.goto(url);
    browserPage = page;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return browserPage;
}
export async function process_for_tock(venuekey: string, venuename: string, longitude: number, latitude: number, address: string, city: string, state: string): Promise<boolean> {
  const result = await tock_basic_search_and_validate(venuename, longitude, latitude, address, city, state);
  if (!result) {
    return false;
  }
  const updateresult = await tock_set_venue_reservation(venuekey, result.slug, result.businessid);
  console.log(updateresult);
  return true;
}
interface TockSearchResult {
  businessid: string;
  slug: string;
}

async function tock_basic_search_and_validate(venuename: string, longitude: number, latitude: number, address: string, city: string, state: string): Promise<TockSearchResult | null> {
  const page = await getBrowerPageSingleton();
  const result = await tock_basic_search(page, venuename, longitude, latitude);
  console.log(result);
  if (result && result.searchResults && result.searchResults.length > 0) {
    console.log(`found ${result.searchResults.length} results for ${venuename}`);
    const entries = result.searchResults;
    for (const entry of entries) {
      const tockLink = `https://www.exploretock.com/${entry.slug}`;
      console.log(tockLink);
      const appconfig = await tock_fetch_app_config(tockLink);
      const ticketAvailableUntil = appconfig.app.config.business.ticketsAvailableUntil;
      // console.log(ticketAvailableUntil);
      // console.log(appconfig.app.config.business);
      const today = dayjs().format("YYYY-MM-DD");
      if (today < ticketAvailableUntil) {
        console.log(`ticket available for ${venuename}`);
        console.log(" tock FOUND real candidate ");

        // Since there is no longitude and latitude in the appconfig, 
        // we can't directly use the distance between the venues
        // Let's check if Country match
        // then whether State, City and Name match
        // whether street match
        if (appconfig.app.config.business.country !== "US") {
          console.log("country mismatch, continue");
          continue;
        }

        if ((appconfig.app.config.business.name === venuename
          && (appconfig.app.config.business.state === "CA" && state === "California")
          && (appconfig.app.config.business.city.toLowerCase() === city.toLowerCase())
        ) || (
            await addressMatch(appconfig.app.config.business.address, address, city, state)
          )) {
          console.log("matched, continue");
          console.log(" tock FOUND real matched >>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          const businessid = appconfig.app.config.business.id;
          const slug = appconfig.app.config.business.domainName;
          return { businessid: businessid, slug: slug };
        }

        console.log(" unfornately neither name not match or address not match ----");
      } else {
        // this means last day ticket available was in the past
        // like restaurant no longer on tock
        console.log(`${venuename} was on tock in the past,  but no tickets available on plaform anymore `);
      }
    }
  }
  console.log(`unfortunately  ---- ${venuename} not found`);
  return null;
}

async function tock_basic_search(page: Page, term: string, longitude: number, latitude: number) {
  const requestdata = newTockSearchRequest(term, longitude, latitude);
  const proto = serializeMsgToProto(requestdata);
  const protoBase64 = Buffer.from(proto).toString("base64");
  const response = await page.evaluate((data: any) => {
    console.log(data);

    // decode the base64-encoded binary data back to binary
    const binarystring = atob(data);
    const len = binarystring.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binarystring.charCodeAt(i);
    }

    const searchurl = "https://www.exploretock.com/api/consumer/suggest/nav";
    return fetch(searchurl, {
      method: "post",
      headers: {
        accept: "application/octet-stream",
        "content-type": "application/octet-stream",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "x-tock-stream-format": "proto2",
        "Accept-Encoding": "identity",
      },
      body: bytes,
    })
      .then((response) => response.arrayBuffer())
      .then((k) => {
        const uint8Array = new Uint8Array(k);
        let binaryString = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        // Encode binary string to Base64
        const base64Encoded = btoa(binaryString);
        return base64Encoded;
      });
  }, protoBase64);
  const binaryResponse = Buffer.from(response, "base64");
  const final = deserializeTockSearchResponseProtoToMsg(binaryResponse);
  return (final.r1?.r2?.r3);
}
interface AppConfig {
  // Define the structure of AppConfig based on what you expect from $REDUX_STATE
  [key: string]: any; // This is a generic definition, specify more detailed properties as needed
}


async function puppeteerFetch(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();
  await browser.close();
  return html;
}


async function tock_fetch_app_config(tocklink: string): Promise<AppConfig> {
  const tockwebsite: string = await puppeteerFetch(tocklink);
  const $ = cheerio.load(tockwebsite);

  // console.log(tockwebsite);
  let appconfig: AppConfig = {};
  $("script").each((i: number, el: cheerio.Element) => {
    let text: string | null = $(el).html();
    if (text?.includes("window.$REDUX_STATE = ")) {
      const toeval: string = text.replace("window.$REDUX_STATE", "appconfig");
      // eslint-disable-next-line no-eval
      eval(toeval);
    }
    // return ;
  });
  return appconfig;
}

export async function tock_set_venue_reservation(
  venue_key: string,
  slug: string,
  businessid: string
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${slug}",
    reservation: "tock",
    businessid: "${businessid}",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;
  const json = await yumyumGraphQLCall(query);
  return json;
};