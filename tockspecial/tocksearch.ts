import { yumyumGraphQLCall } from "yumutil";
import { newTockSearchRequest } from "./tockRequestMsg";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
puppeteer.use(StealthPlugin());

interface Venue {
  name: string;
  urlSlug: string;
  key: string;
}

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

function doubleToByteArray(number: number): number[] {
  const buffer = new ArrayBuffer(8);
  const longNum = new Float64Array(buffer);
  longNum[0] = number;
  return Array.from(new Int8Array(buffer)).reverse();
}

function doubleToFloat64(number: number): string {
  const bytes = doubleToByteArray(number);
  return bytes.map((b) => (b >>> 0).toString(16).padStart(2, "0")).join("");
}

(async function main(): Promise<void> {
  console.log("hello");
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
    headless: false,
  });
  const page = await browser.newPage();
  const url = `https://www.exploretock.com`;
  console.log(`going to ${url}`);
  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("done");
})();
