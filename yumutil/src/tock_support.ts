import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import dayjs from "dayjs";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";
import { getBrowerPageSingleton, getNewBrowerPage, puppeteerFetch } from "./browser_page";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {
  deserializeTockSearchResponseProtoToMsg,
  newTockSearchRequest,
  serializeMsgToProto,
} from "./tockRequestMsg";
import { addressMatch, venueNameSimilar } from "./utils";
import { TockSearchResponse_ResponseRow } from "./TockRequests";
puppeteer.use(StealthPlugin());

export async function process_for_tock(
  saveChanges: boolean,
  venuekey: string,
  venuename: string,
  longitude: number,
  latitude: number,
  address: string,
  city: string,
  state: string
): Promise<boolean> {
  const result = await tock_basic_search_and_validate(
    venuename,
    longitude,
    latitude,
    address,
    city,
    state
  );
  if (!result) {
    return false;
  }
  if (saveChanges) {
    await tock_set_venue_reservation(
      venuekey,
      result.slug,
      result.businessid
    );
  }
  return true;
}


interface TockSearchResult {
  businessid: string;
  slug: string;
}

// venue info is from db, fetched via graphql call
export async function validateTockVenueInfo(venue: any): Promise<boolean> {
  const appconfig = await tock_fetch_app_config(venue.urlSlug);
  if (!appconfig?.app?.config?.business) {
    console.log(`Tock Slug ${venue.urlSlug} has no proper appconfig`);
    return false;
  }
  // check if name matches, and if it's operational 
  if (!venueNameSimilar(appconfig.app.config.business.name, venue.name)) {
    console.log(`Tock Slug ${venue.urlSlug} has name mismatch : ${appconfig.app.config.business.name} !== ${venue.name}`);
    return false;
  }
  const ticketAvailableUntil =
    appconfig.app.config.business.ticketsAvailableUntil;
  const today = dayjs().format("YYYY-MM-DD");
  return today < ticketAvailableUntil;
}

export async function tock_basic_search_and_validate(
  venuename: string,
  longitude: number,
  latitude: number,
  address: string,
  city: string,
  state: string
): Promise<TockSearchResult | null> {
  const searchResults = await tock_basic_search(venuename, longitude, latitude);
  if (searchResults && searchResults.length > 0) {
    console.log(
      `found ${searchResults.length} results for ${venuename} ------------------------`
    );
    const entries = searchResults;
    for (const entry of entries) {
      const appconfig = await tock_fetch_app_config(entry.slug!);
      if (!appconfig?.app?.config?.business) {
        console.log(`Tock Slug ${entry.slug} has no proper appconfig`);
        continue;
      }
      const ticketAvailableUntil =
        appconfig.app.config.business.ticketsAvailableUntil;
      // console.log(ticketAvailableUntil);
      // console.log(appconfig.app.config.business);
      const today = dayjs().format("YYYY-MM-DD");
      if (today < ticketAvailableUntil) {
        // console.log(`ticket available for ${venuename}`);
        // console.log(" tock FOUND real candidate on tock ", entry.name, entry.slug, entry.city);

        const businessid = appconfig.app.config.business.id;
        const slug = appconfig.app.config.business.domainName;
        const candidate = { businessid: businessid, slug: slug };

        // Since there is no longitude and latitude in the appconfig,
        // we can't directly use the distance between the venues
        // Let's check if Country match
        // then whether State, City and Name match
        // whether street match
        if (appconfig.app.config.business.country !== "US") {
          console.log("country mismatch, continue");
          continue;
        }

        if (!(appconfig.app.config.business.state === "CA" &&
          state === "California")) {
          // XXX:TODO make a better state match
          console.log("state mismatch, continue");
          continue;
        }
        if (venueNameSimilar(appconfig.app.config.business.name, venuename)) {
          return candidate;
        }
        if (venueNameSimilar(appconfig.app.config.business.name, venuename)) {
          return candidate;
        }
        if (await addressMatch(
          appconfig.app.config.business.address,
          address,
          city,
          state
        )) {
          return candidate
        }

        console.log(
          " unfornately neither name not match or address not match ----"
        );
      } else {
        // this means last day ticket available was in the past
        // like restaurant no longer on tock
        console.log(
          `${venuename} was on tock in the past,  but no tickets available on plaform anymore `
        );
      }
    }
  }
  console.log(`unfortunately  ---- ${venuename} not found`);
  return null;
}

export async function tock_basic_search(
  term: string,
  longitude: number,
  latitude: number
): Promise<TockSearchResponse_ResponseRow[] | undefined> {
  const page = await getBrowerPageSingleton();
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
  return final.r1?.r2?.r3?.searchResults;
}

interface AppConfig {
  // Define the structure of AppConfig based on what you expect from $REDUX_STATE
  [key: string]: any; // This is a generic definition, specify more detailed properties as needed
}

export async function tock_fetch_app_config(tockslug: string): Promise<AppConfig> {
  const tocklink = `https://www.exploretock.com/${tockslug}`;
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
    withOnlineReservation: "true",
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
}


export async function tockFindCalendarForVenue(slug: string): Promise<string | undefined> {
  const request_processing = (request: any): void => {
    if (request.url().includes("calendar")) {
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

  // Create a signal to wait for post-processing to complete
  let postProcessingComplete: (value: unknown) => void;
  const postProcessingPromise = new Promise(resolve => {
    postProcessingComplete = resolve;
  });

  const page = await getNewBrowerPage();
  await page.setRequestInterception(true);
  page.on("request", request_processing);
  page.on("response", async (response) => {
    if (response.url().includes("calendar")) {
      const text = await response.text();
      postProcessingComplete(text);
    }
  }
  );

  const date = dayjs().format("YYYY-MM-DD");
  const url = `https://www.exploretock.com/${slug}/search?date=${date}&size=2&time=20%3A00`;

  // console.log(`going to ${url}`);
  try {
    await page.goto(url);
  } catch (e) {
    return undefined;
  }

  const timeoutPromise = new Promise(resolve => {
    const timer = setTimeout(() => resolve(undefined), 10000);
    postProcessingPromise.then(() => clearTimeout(timer));
  });

  const result = await Promise.race([
    postProcessingPromise,
    timeoutPromise
  ]);

  return result as string | undefined;
}
