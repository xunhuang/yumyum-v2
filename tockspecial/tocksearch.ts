import {
  yumyumGraphQLCall,
  newTockSearchRequest,
  serializeMsgToProto,
  deserializeTockSearchResponseProtoToMsg,
} from "yumutil";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page, executablePath } from "puppeteer";
puppeteer.use(StealthPlugin());

(async function main(): Promise<void> {
  console.log("hello");
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
    // headless: false,
    headless: "new",
  });
  const page = await browser.newPage();
  const url = `https://www.exploretock.com`;
  console.log(`going to ${url}`);
  await page.goto(url);

  console.log(`waiting 2 secs for page to load`);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    console.log(venue);
    const result = await tock_basic_search(page, venue.name, venue.longitude, venue.latitude);
    console.log(result);
    if (result && result.searchResults && result.searchResults.length > 0) {
      console.log(`found ${result.searchResults.length} results for ${venue.name}`);
      const entries = result.searchResults;
      for (const entry of entries) {
        console.log(entry);
      }
      break;
    }
  }
  console.log("done");
})();

async function tock_basic_search(page: Page, term: string, longitude: number, latitude: number) {
    const requestData = newTockSearchRequest(term, longitude, latitude);
    const proto = serializeMsgToProto(requestData);
  const protoBase64 = Buffer.from(proto).toString("base64");
    const response = await page.evaluate((data: any) => {
      console.log(data);

      // Decode the Base64-encoded binary data back to binary
      const binaryString = atob(data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const searchUrl = "https://www.exploretock.com/api/consumer/suggest/nav";
      return fetch(searchUrl, {
        method: "POST",
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

async function BayAreaListWithTBD() {
  // michelinobjectid: { isNull: false }
  // url: { startsWith: "https://guide.michelin.com" }
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
      close: { equalTo: false }
    }
  ) {
    totalCount
    nodes {
      name
      address
      urlSlug
      key
      michelinslug
      michelinId
      url
      realurl
      michelinobjectid
      tags
      michelineOnlineReservation
      longitude
      latitude
      city
      region
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}

// async function tock_fetch_app_config(tocklink) {
//   const tockwebsite = await simpleFetchGet(tocklink);
//   const $ = cheerio.load(tockwebsite);

//   var appconfig = {};
//   $("script").map((i, el) => {
//     let text = $(el).html();
//     if (text?.includes("window.$REDUX_STATE = ")) {
//       const toeval = text.replace("window.$REDUX_STATE", "appconfig");
//       // eslint-disable-next-line
//       eval(toeval);
//     }
//     return null;
//   });
//   return appconfig;
// }