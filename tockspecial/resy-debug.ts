import { browserPageShutdown, resyLists, tockFindCalendarForVenue, validateResyVenueInfo } from "yumutil";




// function start_something_long() {
//   const promise = new Promise<void>((resolve) => {
//     console.log("long process start");
//     setTimeout(() => {
//       console.log("long process done");
//       resolve();
//     }, 5000);
//   });
//   return promise;
// }

// (async function main() {
//   try {
//     await start_something_long();
//   } catch (error) {
//     console.error(error);
//   }
//   console.log("done");
// })();


import { yumyumGraphQLCall, resy_set_venue_to_tbd } from "yumutil";
import dayjs from "dayjs";
import { getBrowerPageSingleton, puppeteerFetch } from "yumutil";

import { Browser, Handler, Page, executablePath } from "puppeteer"


// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import * as pp from "puppeteer";

puppeteer.use(StealthPlugin());

// const request_processing: Handler<pp.HTTPRequest> = (request: pp.HTTPRequest): void => {


(async function main(): Promise<void> {
  const result = await tockFindCalendarForVenue("ssal");
  console.log("all done ...................... ", result);
  await browserPageShutdown();
})();

// async function scrapeTockCalendarForVenue(slug: string): Promise<string | undefined> {
//   const request_processing = (request: any): void => {
//     if (request.url().includes("calendar")) {
//       const requestParams: any = {
//         method: request.method(),
//         postData: request.postData(),
//         headers: {
//           ...request.headers(),
//           accept: "application/json",
//         }
//       };
//       request.continue(requestParams);
//       return;
//     }
//     request.continue();
//   };

//   // Create a signal to wait for post-processing to complete
//   let postProcessingComplete: (value: unknown) => void;
//   const postProcessingPromise = new Promise(resolve => {
//     postProcessingComplete = resolve;
//   });

//   const page = await getBrowerPageSingleton();
//   await page.setRequestInterception(true);
//   page.on("request", request_processing);
//   page.on("response", async (response) => {
//     if (response.url().includes("calendar")) {
//       const text = await response.text();
//       postProcessingComplete(text);
//     }
//   }
//   );

//   const date = dayjs().format("YYYY-MM-DD");
//   const url = `https://www.exploretock.com/${slug}/search?date=${date}&size=2&time=20%3A00`;

//   console.log(`going to ${url}`);
//   try {
//     await page.goto(url);
//   } catch (e) {
//     return undefined;
//   }

//   const result = await Promise.race([
//     postProcessingPromise,
//     new Promise(resolve => setTimeout(resolve, 10000))
//   ]);

//   return result as string | undefined;
// }
