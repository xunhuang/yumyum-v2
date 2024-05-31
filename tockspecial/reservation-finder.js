const buildUrl = require("build-url");
const cheerio = require("cheerio");

const { saveToRedisWithChunking } = require("./saveToRedisWithChunking");
const { RateLimiter } = require("limiter");
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

const dayjs = require("dayjs");
const { resy_calendar_key } = require("./resy_support");
const { resyLists } = require("./resy_support");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log(v);
      const content = await fetch(
        v.url,
        // const content = await fetch(
        //   "https://guide.michelin.com/us/en/california/calistoga/restaurant/solbar",
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            priority: "u=0, i",
            "sec-ch-ua":
              '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
        }
      );

      const body = await content.text();
      const $ = cheerio.load(body);

      var reservation_links = [];
      $('a[data-event="partner_book"]').each((index, element) => {
        console.log(element.attribs["href"]);
        reservation_links.push(element.attribs["href"]);
      });
      if (reservation_links.length === 0) {
        $('button[data-dtm-partner="resy"]').each((index, element) => {
          const scriptTag = $("script")
            .filter((i, el) => $(el).html().includes("venueId"))
            .html();

          if (scriptTag) {
            const venueIdMatch = scriptTag.match(/venueId:\s*'(\d+)'/);
            const venueId = venueIdMatch ? venueIdMatch[1] : null;
            console.log("resy", venueId);
          } else {
            console.log("resy: venueId not found");
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
      close: { equalTo: false }
      michelinobjectid: { isNull: false }
      url: { startsWith: "https://guide.michelin.com" }
    }
  ) {
    totalCount
    nodes {
      name
      urlSlug
      key
      michelinslug
      michelinId
      url
      realurl
      michelinobjectid
      tags
      michelineOnlineReservation
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
