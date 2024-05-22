const { Redis } = require("@upstash/redis");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const buildUrl = require("build-url");
const { resy_calendar_key } = require("./resy_support");
const { resyLists } = require("./resy_support");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const dayjs = require("dayjs");

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
    // const l = rl.filter((v) => v.name == "Lord Stanley");
    const l = rl;
    console.log(l);
    for (i = 0; i < l.length && i < 1000; i++) {
      v = l[i];

      const key = resy_calendar_key(v.urlSlug, party_size);
      console.log(key);
      const calendar = await redis.get(
        resy_calendar_key(v.urlSlug, party_size)
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

async function newFindReservation(venue_id, date, party_size) {
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
