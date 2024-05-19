const { Redis } = require("@upstash/redis");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const dayjs = require("dayjs");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

var GlobalResults = {};

async function tockSlugs() {
  const query = `
    query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}, reservation: {equalTo: "tock"}, close: {equalTo: false}}
  ) {
nodes {
        name
        urlSlug
      }
  }
}`;
  const json = await yumyumGraphQLCall(query);

  const nodes = json.data.allVenues.nodes;
  const slugs = nodes.map((n) => n.urlSlug);
  console.log(JSON.stringify(slugs));
  return slugs;
}

const response_processing = async (response) => {
  if (response.url().includes("calendar")) {
    const status = response.status();
    console.log("<<", status, response.url());
    const requestheader = response.request().headers();

    if (status != "200") {
      console.log(requestheader);
      return;
    }

    try {
      const text = await response.text();
      console.log(text.slice(0, 220));
      const lastPath = requestheader["x-tock-path"];
      const slug = lastPath.split("/")[1];
      GlobalResults[slug] = text;

      // potentially we can save to Redis here instead of waiting till the end

      const calendar = JSON.parse(GlobalResults[slug]);
      if (calendar && calendar.result.ticketGroupByBusinessDay) {
        await saveToRedis(slug, calendar);
      }
    } catch (e) {
      console.log("problem readding response for url ", response.url());
      console.log(requestheader);
      console.log(e);
    }
  }
};
const request_processing = (request) => {
  if (request.url().includes("calendar")) {
    console.log(">>", request.method(), request.url());
    const requestParams = {};
    requestParams.method = request.method();
    requestParams.postData = request.postData();

    var headers = {
      ...request.headers(),
      accept: "application/json",
    };
    requestParams.headers = headers;
    request.continue(requestParams);
    return;
  }
  request.continue();
};

(async function main() {
  try {
    // const BayAreaSlugs = [
    //   "italico",
    //   "thetableatmerchantroots",
    //   "umma",
    //   "thetableatmerchantroots",
    //   "lion-dance-cafe-oakland",
    // ];

    const BayAreaSlugs = await tockSlugs();
    await scrapeTockList(BayAreaSlugs);
    console.log("all done - saving to redis may continue before exiting");
  } catch (error) {
    console.error(error);
  }
})();

async function saveToRedis(slug, calendar) {
  const result = {};
  for (d in calendar.result.ticketGroupByBusinessDay) {
    if (calendar.result.ticketGroupByBusinessDay[d].ticketGroupByDate[d]) {
      result[`${slug}-${d}`] = JSON.stringify(
        calendar.result.ticketGroupByBusinessDay[d].ticketGroupByDate[d]
          .ticketGroup
      );
    }
  }

  const chunks = chunkObject(result, 1000000); // 1 Mbytes
  for (const chunk of chunks) {
    try {
      console.log(`${slug} Chunk size: ${Object.keys(chunk).length} keys`);
      console.log(
        `${slug} Total size: ${
          new TextEncoder().encode(JSON.stringify(chunk)).length
        } bytes`
      );
      await redis.mset(chunk);
    } catch (e) {
      console.log("REDIS ERROR for " + e);
    }
  }
}

async function scrapeTockList(slugsList) {
  const browser = await puppeteer.launch({ headless: "new" });
  for (var i = 0; i < slugsList.length && i < 2000; i++) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", request_processing);
    page.on("response", response_processing);

    var slug = slugsList[i];
    GlobalResults[slug] = null;
    const date = dayjs().format("YYYY-MM-DD");
    const url = `https://www.exploretock.com/${slug}/search?date=${date}&size=2&time=20%3A00`;

    console.log(`going to ${url}`);
    await page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log("done with scraping");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await browser.close();
}

function chunkObject(obj, chunkSizeInBytes) {
  const chunks = [];
  let chunk = {};

  let currentChunkSize = 0;
  for (const [key, value] of Object.entries(obj)) {
    const entrySize = new TextEncoder().encode(
      JSON.stringify({ [key]: value })
    ).length;
    if (currentChunkSize + entrySize > chunkSizeInBytes) {
      chunks.push(chunk);
      chunk = {};
      currentChunkSize = 0;
    }
    chunk[key] = value;
    currentChunkSize += entrySize;
  }

  if (Object.keys(chunk).length > 0) {
    chunks.push(chunk);
  }

  return chunks;
}
