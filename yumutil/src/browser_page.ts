import puppeteer from "puppeteer-extra";
import { Browser, Page, executablePath } from "puppeteer";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

var browser: Browser | undefined;
var browserPage: Page | undefined;

export async function getBrowerPageSingleton(): Promise<Page> {
  if (!browserPage) {
    browser = await puppeteer.launch({
      executablePath: executablePath(),
      headless: true,
    });
    const page = await browser.newPage();
    const url = `https://www.exploretock.com`;
    try {
      await page.goto(url);
    } catch (error) {
      console.error(`Error fetching URL: ${url}`, error);
      throw error;
    }
    browserPage = page;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return browserPage;
}

export async function getNewBrowerPage(): Promise<Page> {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: executablePath(),
      headless: true,
    });
  }
  return await browser.newPage();
}

export async function browserPageShutdown(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = undefined;
    browserPage = undefined;
  }
}

export async function puppeteerFetch(url: string): Promise<string> {
  const page = await getBrowerPageSingleton();
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
    throw error;
  }
  const html = await page.content();
  return html;
}
