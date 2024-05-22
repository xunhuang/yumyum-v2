const buildUrl = require("build-url");

const { saveToRedisWithChunking } = require("./saveToRedisWithChunking");
const { RateLimiter } = require("limiter");
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

const dayjs = require("dayjs");
const { resy_calendar_key } = require("./resy_support");
const { resyLists } = require("./resy_support");

(async function main() {
  try {
    const rl = await resyLists();
    const partylist = [2, 3, 4, 1, 5, 6, 7, 8, 9, 10];
    for (party_size of partylist) {
      const answers = {};
      const l = rl;
      console.log(l);
      for (let i = 0; i < l.length && i < 1000; i++) {
        const v = l[i];
        const calendar = await resy_calendar(
          v.businessid,
          party_size,
          v.name,
          30
        );
        if (calendar.status == 429) {
          console.log(v.urlSlug, party_size, "Rate limiting exceeded");
          continue;
        }
        answers[resy_calendar_key(v.urlSlug, party_size)] = calendar;
        console.log(v.name, party_size, "done");
      }
      console.log(answers);
      await saveToRedisWithChunking(answers, `party of ${party_size}`);
    }
  } catch (error) {
    console.error(error);
  }
})();

async function resy_calendar(venue_id, num_seats, name, days_ahead) {
  await limiter.removeTokens(1);
  //   const today = dayjs().add(1, "days").format("YYYY-MM-DD");
  const today = dayjs().add(-1, "days").format("YYYY-MM-DD");
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
