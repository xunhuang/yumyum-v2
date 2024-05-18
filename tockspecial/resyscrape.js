const { Redis } = require("@upstash/redis");

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

const BayAreaSlugs = require("./bayareatockslug.json");
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

console.log(BayAreaSlugs);

(async function main() {
  try {
    const a = await fetch("https://graph-3khoexoznq-uc.a.run.app/graphql", {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: '{"query":"query MyQuery {\\n  allVenues(\\n    filter: {metro: {equalTo: \\"bayarea\\"}, reservation: {equalTo: \\"tock\\"}}\\n  ) {\\nnodes {\\n        name\\n        urlSlug\\n      }\\n  }\\n\\n}\\n","variables":null,"operationName":"MyQuery"}',
      method: "POST",
    });

    const json = await a.json();
    const nodes = json.data.allVenues.nodes;
    const slugs = nodes.map((n) => n.urlSlug);
    console.log(JSON.stringify(slugs));
  } catch (error) {
    console.error(error);
  }
})();
