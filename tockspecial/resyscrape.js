const { Redis } = require("@upstash/redis");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const buildUrl = require("build-url");
const { RateLimiter } = require("limiter");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 });

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const dayjs = require("dayjs");
const { CssOutlined } = require("@mui/icons-material");

(async function main() {
  const partySizeArg = process.argv[2];
  const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

  if (isNaN(party_size) || party_size < 1) {
    console.error("Please provide a valid numeric value for party size.");
    process.exit(1);
  }
  try {
    const rl = await resyLists();
    console.log(rl);
    // const l = rl.filter((v) => v.name == "AltoVino");
    const l = rl.filter((v) => v.name == "Lord Stanley");
    console.log(l);
    for (i = 0; i < l.length && i < 1000; i++) {
      v = l[i];
      const calendar = await resy_calendar(
        v.businessid,
        party_size,
        v.name,
        30
      );
      const entries = calendar.scheduled;
      console.log(calendar);
      continue;
      if (entries.length > 0) {
        // for (line of entries) {
        entries.map(async (line) => {
          if (line.inventory.reservation == "available") {
            // console.log(line.date);
            const date_avail_data = await newFindReservation(
              v.businessid,
              line.date,
              party_size
            );

            if (date_avail_data.results.venues[0]) {
              console.log(
                // date_avail_data.results.venues[0].slots.map((s) => s.date.start)
                v.name,
                line.date,
                date_avail_data.results.venues[0].slots.length,
                "entries for party of ",
                party_size
              );
            } else {
              // console.log("XXXXX");
              // console.log(date_avail_data.results);
            }
          }
        });
        // }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error(error);
  }
})();

async function resyLists() {
  const query = `
  query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}, reservation: {equalTo: "resy"}, close:{equalTo:false}}
  ) {
nodes {
        name
        urlSlug
        businessid
      }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}

async function resy_calendar(venue_id, num_seats, name, days_ahead) {
  const today = dayjs().add(1, "days").format("YYYY-MM-DD");
  const enddate = dayjs().add(days_ahead, "days").format("YYYY-MM-DD");

  const url = buildUrl("https://api.resy.com", {
    path: "4/venue/calendar",
    queryParams: {
      venue_id: venue_id,
      num_seats: num_seats,
      start_date: today,
      end_date: enddate,
    },
  });
  console.log(name + " " + url);
  const a = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "cache-control": "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-origin": "https://resy.com",
    },
    referrer: "https://resy.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  const json = await a.json();
  return json;
}

async function newFindReservation(venue_id, date, party_size) {
  await limiter.removeTokens(1);
  const a = await fetch(
    buildUrl("https://api.resy.com", {
      path: "4/find",
      queryParams: {
        lat: 0,
        long: 0,
        day: date,
        party_size: party_size,
        venue_id: venue_id,
      },
    }),
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
        "cache-control": "no-cache",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-origin": "https://resy.com",
      },
      referrer: "https://resy.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );
  return await a.json();
}
