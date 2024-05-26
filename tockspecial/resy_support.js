const buildUrl = require("build-url");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { RateLimiter } = require("limiter");
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

function resy_calendar_key(slug, party_size) {
  return `resy-calendar-${slug}-${party_size}`;
}
exports.resy_calendar_key = resy_calendar_key;
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
exports.resyLists = resyLists;
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
exports.newFindReservation = newFindReservation;
function resy_day_key(slug, date, party_size) {
  return `resy-${slug}-${date}-${party_size}`;
}
exports.resy_day_key = resy_day_key;
