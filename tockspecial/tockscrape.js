const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const dayjs = require("dayjs");

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { saveToRedisWithChunking } = require("./saveToRedisWithChunking");
const { resy_set_venue_to_tbd } = require("./resy_support");
puppeteer.use(StealthPlugin());

var GlobalResults = {};
var GlobalSlugMap = {};

async function tockDbData() {
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

  const nodes = json.data.allVenues.nodes;
  return nodes;
}

const response_processing = async (response) => {
  if (response.url().includes("calendar")) {
    const status = response.status();
    console.log("<<", status, response.url());
    const requestheader = response.request().headers();
    const lastPath = requestheader["x-tock-path"];
    const slug = lastPath.split("/")[1];

    if (status !== 200) {
      console.log("XXX status !=200 problem readding response for ", lastPath);
      // even though we get an error, this might be a transient network issue
      // so let's not be too aggressive in marking this as a bad venue
      return;
    }

    try {
      const text = await response.text();
      console.log(text.slice(0, 220));
      GlobalResults[slug] = text;

      // potentially we can save to Redis here instead of waiting till the end

      const calendar = JSON.parse(GlobalResults[slug]);
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
        // If we get here, a proper response was received, but it was empty
        // this means it's not likely a transient network issue. So let's mark this as a bad venue
        // item as TBD
        resy_set_venue_to_tbd(GlobalSlugMap[slug].key);
      }
    } catch (e) {
      console.log("XXX problem readding response for ", lastPath);
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
    const tockdata = await tockDbData();
    const BayAreaSlugs = tockdata.map((v) => v.urlSlug);

    GlobalSlugMap = tockdata.reduce((acc, element) => {
      acc[element.urlSlug] = element;
      return acc;
    }, {});

    await scrapeTockList(BayAreaSlugs);
    console.log("all done - saving to redis may continue before exiting");
  } catch (error) {
    console.error(error);
  }
})();

async function saveToRedis(slug, calendar) {
  const result = {};
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
