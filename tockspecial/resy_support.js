const buildUrl = require("build-url");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { RateLimiter } = require("limiter");
const dayjs = require("dayjs");
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
        key
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

exports.resy_set_venue_to_tbd = async function (venue_key) {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    reservation: "TBD"
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
}
exports.opentable_set_venue_reservation = async function (venue_key, businessid) {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    reservation: "opentable",
    businessid: "${businessid}",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
}

exports.tock_set_venue_reservation = async function (venue_key, slug, businessid) {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${slug}",
    reservation: "tock",
    businessid: "${businessid}",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;
  const json = await yumyumGraphQLCall(query);
  return json;
}

exports.resy_set_venue_reservation = async function (venue_key, slug, resycityCode, venue_id) {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${slug}",
    reservation: "resy",
    businessid: "${venue_id}",
    resyCityCode: "${resycityCode}",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
}
async function resyAPIFetch(url) {
  const a = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "cache-control": "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
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
exports.resyAPIFetch = resyAPIFetch;

async function simpleFetchGet(url) {
  const content = await fetch(
    url,
    {
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        priority: "u=0, i",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
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
  return body;
}
exports.simpleFetchGet = simpleFetchGet;
async function resyAPILookupByVenueID(venue_id) {
  const url = buildUrl("https://api.resy.com", {
    path: "4/find",
    queryParams: {
      long: 0,
      lat: 0,
      venue_id: venue_id,
      party_size: 2,
      day: dayjs().format("YYYY-MM-DD"),
    },
  });
  return await resyAPIFetch(url);
}
exports.resyAPILookupByVenueID = resyAPILookupByVenueID;

