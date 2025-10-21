#!/usr/bin/env ts-node

import path from 'path';
import fs from 'fs/promises';
import { createHash } from 'crypto';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { setTimeout as delay } from 'timers/promises';
import type { Browser, ElementHandle, Frame, Page } from 'puppeteer';
import { parseDocument } from 'htmlparser2';
import { selectAll } from 'css-select';
import type { Element as DomElement } from 'domhandler';
import { setVenueReservationToNone, setVenueToClosed, BayAreaListWithTBD } from 'yumutil';

// import places from './places';

puppeteer.use(StealthPlugin());

const chromeProfileDir = path.resolve(process.cwd(), '.chrome-profile');
const reservePhrase = 'reserve a table';
const cacheBaseDir = path.resolve(process.cwd(), '.cache');
const htmlCacheDir = path.join(cacheBaseDir, 'html');
const screenshotCacheDir = path.join(cacheBaseDir, 'screenshots');

type HtmlCacheStage = 'search' | 'reservation';

function buildCacheFilePrefix(query: string): string {
  const normalized = query.trim().toLowerCase();
  const slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'query';
  const hash = createHash('sha1').update(normalized).digest('hex').slice(0, 10);
  return `${slug}-${hash}`;
}

function htmlCachePath(query: string, stage: HtmlCacheStage): `${string}.html` {
  return path.join(htmlCacheDir, `${buildCacheFilePrefix(query)}-${stage}.html`) as `${string}.html`;
}

function screenshotCachePath(query: string, stage: 'search' | 'reservation'): `${string}.png` {
  return path.join(screenshotCacheDir, `${buildCacheFilePrefix(query)}-${stage}.png`) as `${string}.png`;
}

async function readCachedHtml(query: string, stage: HtmlCacheStage): Promise<{ html: string; path: string } | null> {
  const cachePath = htmlCachePath(query, stage);
  try {
    const html = await fs.readFile(cachePath, 'utf-8');
    return { html, path: cachePath };
  } catch (error) {
    if ((error as { code?: string }).code !== 'ENOENT') {
      console.warn(`Unable to read cache file ${cachePath}:`, error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

async function writeCachedHtml(query: string, stage: HtmlCacheStage, html: string): Promise<string> {
  await fs.mkdir(htmlCacheDir, { recursive: true });
  const cachePath = htmlCachePath(query, stage);
  await fs.writeFile(cachePath, html, 'utf-8');
  return cachePath;
}

const readCachedReservationHtml = (query: string) => readCachedHtml(query, 'reservation');
const readCachedSearchHtml = (query: string) => readCachedHtml(query, 'search');

const writeCachedReservationHtml = (query: string, html: string) => writeCachedHtml(query, 'reservation', html);
const writeCachedSearchHtml = (query: string, html: string) => writeCachedHtml(query, 'search', html);

async function openInViewer(filePath: string): Promise<void> {
  const platform = process.platform;
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(command, [filePath], {
      detached: true,
      stdio: 'ignore',
      shell: platform === 'win32',
    });
    child.unref();
    console.log('Opened screenshot in the default image viewer.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Unable to automatically display the screenshot:', message);
  }
}

async function randomDelay(min: number, max: number): Promise<void> {
  const ms = min + Math.random() * (max - min);
  await delay(ms);
}

async function maybeHandleConsent(page: Page): Promise<void> {
  const consentSelectors = [
    'button[aria-label="Accept all"]',
    '#L2AGLb',
    'button[aria-label="I agree"]',
    '#introAgreeButton',
  ];

  for (const selector of consentSelectors) {
    const elementHandle = await page.$(selector);
    if (elementHandle) {
      await elementHandle.click();
      await randomDelay(600, 1000);
      return;
    }
  }

  for (const frame of page.frames()) {
    for (const selector of consentSelectors) {
      const buttonHandle = await frame.$(selector);
      if (buttonHandle) {
        await buttonHandle.click();
        await randomDelay(600, 1000);
        return;
      }
    }
  }
}

async function ensureResultsLoaded(page: Page, query: string): Promise<void> {
  const candidateSelectors = ['#search', '#rcnt', '#center_col', 'div[role="main"]', 'div[data-hveid]'];

  await randomDelay(1000, 1800);
  const indicatorFound = await page
    .evaluate(
      (selectors, q) => {
        const normalize = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();
        const lowerQuery = normalize(q);
        const selectorHit = selectors.some((selector) => Boolean(document.querySelector(selector)));
        const titleMatches = normalize(document.title).includes(lowerQuery);
        const bodyText = normalize(document.body?.innerText ?? '');
        const bodyMatches = bodyText.includes(lowerQuery) || bodyText.includes(lowerQuery.replace(/\s+/g, '\n'));
        return selectorHit || (titleMatches && bodyMatches);
      },
      candidateSelectors,
      query,
    )
    .catch(() => false);

  if (!indicatorFound) {
    console.warn('Search results container not confirmed before screenshot; continuing anyway.');
  }
}

async function createStealthBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: false,
    userDataDir: chromeProfileDir,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--lang=en-US,en',
      '--window-size=1366,768',
      '--start-maximized',
    ],
  });
}

async function performSearch(page: Page, query: string): Promise<Page> {
  await page.setViewport({ width: 1280, height: 720 });
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );

  console.log('Navigating to https://www.google.com ...');
  await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  await randomDelay(500, 1000);
  await maybeHandleConsent(page);

  await page.waitForSelector('textarea[name="q"]', { timeout: 20000, visible: true });

  await page.mouse.move(200 + Math.random() * 200, 200 + Math.random() * 150, { steps: 15 });
  await randomDelay(400, 700);

  console.log(`Performing search for "${query}" ...`);
  await page.focus('textarea[name="q"]');
  await page.keyboard.type(query, { delay: 65 + Math.random() * 40 });

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 40000 }),
    (async () => {
      await randomDelay(350, 500);
      await page.keyboard.press('Enter');
    })(),
  ]);

  await randomDelay(800, 1600);

  const finalUrl = page.url();
  console.log(`Arrived at ${finalUrl}`);

  if (finalUrl.includes('/sorry/')) {
    throw new Error('Google presented an anti-bot verification page.');
  }

  await ensureResultsLoaded(page, query);
  return page;
}

function buildTextCatalog(): string[] {
  return ['innerText', 'textContent', 'ariaLabel', 'title', 'ariaDescription', 'aria-labelledby', 'aria-describedby'];
}

async function findReserveButtonInFrame(frame: Frame): Promise<ElementHandle<Element> | null> {
  const found = await frame
    .evaluate(
      (markerAttribute, target, attributes) => {
        const normalize = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
        const matches = (element: HTMLElement) => {
          const values: string[] = [];
          for (const attr of attributes) {
            if (attr === 'innerText') {
              values.push(normalize(element.innerText));
            } else if (attr === 'textContent') {
              values.push(normalize(element.textContent));
            } else if (attr === 'ariaLabel') {
              values.push(normalize(element.ariaLabel));
            } else {
              const attributeValue = element.getAttribute(attr === 'ariaDescription' ? 'aria-description' : attr);
              values.push(normalize(attributeValue ?? ''));
            }
          }

          const composite = values.join(' ');
          return composite.includes(target);
        };

        const selectors = [
          'a',
          'button',
          '[role="button"]',
          'div',
          'span',
          'g-flat-button',
          'g-raised-button',
        ];

        const visited = new Set<HTMLElement>();
        for (const selector of selectors) {
          const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
          for (const element of elements) {
            if (visited.has(element)) {
              continue;
            }
            visited.add(element);

            if (!matches(element)) {
              continue;
            }

            const clickable = (element.closest('a, button, [role="button"]') as HTMLElement | null) ?? element;
            clickable.setAttribute(markerAttribute, 'true');
            return true;
          }
        }

        return false;
      },
      'data-codex-reserve-target',
      reservePhrase,
      buildTextCatalog(),
    )
    .catch(() => false);

  if (!found) {
    return null;
  }

  const handle = await frame.$('[data-codex-reserve-target="true"]');
  await frame.evaluate((markerAttribute) => {
    document
      .querySelectorAll(`[${markerAttribute}="true"]`)
      .forEach((element) => (element as HTMLElement).removeAttribute(markerAttribute));
  }, 'data-codex-reserve-target');

  return handle ?? null;
}

async function findReserveButton(page: Page): Promise<ElementHandle<Element> | null> {
  const frames: Frame[] = [page.mainFrame(), ...page.frames().filter((frame) => frame !== page.mainFrame())];

  for (const frame of frames) {
    const handle = await findReserveButtonInFrame(frame);
    if (handle) {
      return handle;
    }
  }

  return null;
}

async function tryOpenReserve(page: Page, browser: Browser): Promise<Page | null> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const targetHandle = await findReserveButton(page);
    if (!targetHandle) {
      await randomDelay(1000, 2000);
      continue;
    }

    console.log('"Reserve a table" button located. Attempting click...');

    await targetHandle.evaluate((element: Element) => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await randomDelay(700, 1400);

    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => null);
    const newPagePromise = browser
      .waitForTarget(
        (target) => target.type() === 'page' && target.opener() === page.target(),
        { timeout: 20000 },
      )
      .then((target) => target.page())
      .catch(() => null);

    await targetHandle.click({ delay: 60 + Math.random() * 90 });
    await randomDelay(600, 1200);

    const [navResult, newPage] = await Promise.all([navigationPromise, newPagePromise]);
    await targetHandle.dispose();

    const destinationPage = newPage ?? (navResult ? page : null);
    if (destinationPage) {
      const activePage = destinationPage === page ? page : destinationPage;
      await activePage.bringToFront();

      if (activePage !== page) {
        await activePage.waitForFunction(() => document.readyState === 'complete', { timeout: 20000 }).catch(() => null);
      }

      await randomDelay(1000, 1800);
      return activePage;
    }
  }

  return null;
}

async function captureScreenshot(targetPage: Page, targetPath: `${string}.png`): Promise<void> {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await targetPage.screenshot({ path: targetPath, fullPage: true });
  console.log(`Screenshot saved to ${targetPath}`);

  const fileBuffer = await fs.readFile(targetPath);
  console.log(`Screenshot size: ${(fileBuffer.byteLength / 1024).toFixed(1)} KB`);

  // await openInViewer(targetPath);
}

type DataSlotRecord = {
  tagName: string;
  dataSlot: string;
};

function collectDataSlotsFromHtml(html: string): DataSlotRecord[] {
  const document = parseDocument(html);
  const nodes = selectAll('[data-slot]', document) as unknown as DomElement[];

  return nodes
    .map((node) => ({
      tagName: node.name ?? 'unknown',
      dataSlot: node.attribs?.['data-slot'] ?? '',
    }))
    .filter((record) => Boolean(record.dataSlot));
}

// async function extractDataSlots(page: Page): Promise<DataSlotRecord[]> {
//   const html = await page.content();
//   return collectDataSlotsFromHtml(html);
// }

// function printDataSlots(label: string, slots: DataSlotRecord[]): void {
//   if (slots.length === 0) {
//     console.warn(`${label} did not expose any elements with [data-slot].`);
//     return;
//   }

//   console.log(`${label} [data-slot] elements (${slots.length}):`);
//   slots.forEach((record, index) => {
//     console.log(`  ${index + 1}. <${record.tagName}> data-slot="${record.dataSlot}"`);
//   });
// }

async function performSearchAndCaptureScreenshot(
  browser: Browser,
  page: Page,
  searchQuery: string,
  options: { useCache: boolean } = { useCache: true },
): Promise<null | undefined> {
  if (options.useCache) {
    const cachedSearch = await readCachedSearchHtml(searchQuery);
    if (cachedSearch) {
      return null;
    }
  }

  const resultsPage = await performSearch(page, searchQuery);
  console.log('Search results page loaded..................................');
  const searchResultsScreenshotPath = screenshotCachePath(searchQuery, 'search');
  await captureScreenshot(resultsPage, searchResultsScreenshotPath);

  try {
    console.log('about to save search HTML to cache..................................');
    const searchHtml = await resultsPage.content();
    const searchCachePath = await writeCachedSearchHtml(searchQuery, searchHtml);
    console.log(`Cached search HTML at ${searchCachePath}`);
  } catch (error) {
    console.warn('Unable to cache search HTML:', error instanceof Error ? error.message : String(error));
  }

  return null;
}

async function performSearchForPlaces(): Promise<void> {
  const places = await BayAreaListWithTBD();
  const args = new Set(process.argv.slice(2));
  const useCache = !args.has('--no-cache');

  if (!useCache) {
    console.log('Cache disabled via --no-cache; performing live searches.');
  }

  console.log('Launching stealth browser...');
  const browser = await createStealthBrowser();

  try {
    const [initialPage] = await browser.pages();
    const page = initialPage ?? (await browser.newPage());

    for (const place of places) {
      const searchQuery = place.name + ' ' + place.city + ' ' + place.region;
      const url = await performSearchAndCaptureScreenshot(browser, page, searchQuery, { useCache });
      console.log(url);
    }
  } finally {
    await browser.close();
  }
}

function parseGooglePayload(raw: string) {
  // 1. Drop everything before the first “[”
  const i = raw.indexOf("[");
  if (i === -1) throw new Error("No JSON found in input");
  const body = raw.slice(i); // e.g. [ ... ],[ ... ]

  // 2. Wrap in brackets to make it a valid single JSON array
  const wrapped = `[${body}`;
  // 3. Parse
  return JSON.parse(wrapped);
}

function findUrlInJson(obj: any): string | null {
  if (typeof obj === 'string') {
    // Basic URL pattern, can be improved if needed
    if (/^https?:\/\/[^\s"]+$/.test(obj)) {
      return obj;
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findUrlInJson(item);
      if (found) return found;
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const found = findUrlInJson(obj[key]);
      if (found) return found;
    }
  }
  return null;
}

function findSlotURLFromHtml(html: string): string | null {
  const dataSlots = collectDataSlotsFromHtml(html);
  if (dataSlots.length > 0) {
    const first = dataSlots[0];
    const payload = parseGooglePayload(first.dataSlot);
    return findUrlInJson(payload);
  }
  return null;
}

// Use cheerio to parse and query the HTML
const cheerio = require('cheerio');
function findMapReservationURLFromHtml(html: string): string | null {
  // Example: run a CSS selector for all <a> elements with an href attribute
  const $ = cheerio.load(html);

  const links = $('a[href]');
  const urls: string[] = [];
  links.each((i: number, el: any) => {
    const href = $(el).attr('href');
    const text = $(el).text();
    if (text.toLowerCase().includes(reservePhrase.toLowerCase())) {
      console.log(href);
      urls.push(href);
    }
  });
  if (urls.length > 0) {
    return urls[0];
  }
  return null;
}

function isGoogleRservationPageClosed(html: string) {
  const $ = cheerio.load(html);
  const nodes = $("g-accordion-expander");
  for (const n of nodes) {
    const text = $(n).text().trim();
    if (text.startsWith("Temporarily closed") || text.startsWith("Permanently closed")) {
      return true;
    }
  }
  return false;

}

async function navigateToGoogleReservationURL(): Promise<void> {
  const places = await BayAreaListWithTBD();
  console.log('Places: ', places.length);
  console.log('Places: ', places);
  try {
    const browser = await createStealthBrowser();
    try {
      for (const place of places) {
        const searchQuery = place.name + ' ' + place.city + ' ' + place.region;
        const cachedReservation = await readCachedSearchHtml(searchQuery);
        if (cachedReservation && cachedReservation.html) {
          const html = cachedReservation.html;
          const url = findMapReservationURLFromHtml(html);
          if (!url) {
            console.log('No URL found for ', searchQuery);
            const isClosed = isGoogleRservationPageClosed(html);
            if (isClosed) {
              console.log('Google reservation page is closed for ', searchQuery);
              console.log('Setting venue to closed for ', place.key);
              await setVenueToClosed(place.key, 'google places web search');
              continue;
            } else {
              console.log('Google reservation page is open but not reservation system ', searchQuery);
              await setVenueReservationToNone(place.key, "google places web search");
            }
            continue;
          }

          console.log('Opening browser for ', url);
          const page = await browser.newPage();
          await page.goto(url!, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const pageContent = await page.content();
          const sloturl = findSlotURLFromHtml(pageContent);
          console.log('Slot URL: ', sloturl);
          await page.close();
        };
      }
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.warn('Could not read reservation-debug.html:', err instanceof Error ? err.message : err);
  }
}

async function main(): Promise<void> {
  // await performSearchForPlaces();
  await navigateToGoogleReservationURL();
}

main().catch((error) => {
  console.error('Fatal error:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

