const { Redis } = require("@upstash/redis");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");

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

const dayjs = require("dayjs");

var lastPath = "";

function isJSON(str) {
  try {
    JSON.stringify(JSON.parse(str));
    return true;
  } catch (e) {
    return false;
  }
}

(async function main() {
  try {
    await tockSlugs();
  } catch (error) {
    console.error(error);
  }
})();

async function tockSlugs() {
  const query = `
  query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}, reservation: {equalTo: "resy"}}
  ) {
nodes {
        name
        urlSlug
        businessid
      }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  console.log(JSON.stringify(json));
}
