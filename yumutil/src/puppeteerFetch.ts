import { HTTPResponse, HTTPRequest, Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

let scrapingBrowser: Browser | null = null;
let scrapingPage: Page | null = null;
async function getBrowserPageSingleton() {
  if (!scrapingPage) {
    // if (scrapingBrowser) {
    //   await scrapingBrowser!.close();
    // }
    console.log("launching new browser");
    // Always launch browser in non-headless mode to show interactively
    scrapingBrowser = await puppeteer
      .launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox", // uncomment if needed for your environment
        ],
      })
      .catch((error) => {
        console.log("Failed to launch browser:", error);
        throw error;
      });
    const page = await scrapingBrowser.newPage();
    scrapingPage = page;
  }
  return scrapingPage;
}

export async function puppeteerFetchJson(
  url: string,
  waitMs: number = 0
): Promise<object | null> {
  try {
    const page = await getBrowserPageSingleton();
    console.log(`going to ${url}`);
    await page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const json = await page.evaluate(() => {
      return JSON.parse(document.body.innerText);
    });
    return json;
  } catch (error) {
    console.log(
      `puppeteerFetchJson Error fetching json object URL: ${url}`,
      error
    );
    return null;
  }
}
