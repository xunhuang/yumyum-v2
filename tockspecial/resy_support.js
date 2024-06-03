const buildUrl = require("build-url");
const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { RateLimiter } = require("limiter");
const dayjs = require("dayjs");
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });
const getDistance = require("geolib").getDistance;
const { venueNameMatched, addressMatch } = require("./util");

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


async function resy_find_location_details(slug, location) {
  const result = await resyAPIFetch(
    buildUrl("https://api.resy.com", {
      path: "3/venue",
      queryParams: {
        url_slug: slug,
        location: location,
      },
    }));
  console.log(result);
  return result?.location;
}


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

async function resy_set_venue_reservation(venue_key, slug, resycityCode, venue_id) {
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
exports.resy_set_venue_reservation = resy_set_venue_reservation;
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

async function resy_basic_search_and_validate(
  term,
  longitude,
  latitude,
  address
) {

  const makeResult = (entry) => {
    const result = {
      name: entry.name,
      businessid: `${entry.id.resy}`,
      urlSlug: entry.url_slug,
      resyCityCode: entry.location.code,
    };
    return result;
  };

  const result = await resy_basic_search(term, longitude, latitude);

  for (const entry of result) {
    console.log("checking", entry);
    const resy_id = entry.id.resy;
    const entryLongitude = entry._geoloc.lng;
    const entryLatitude = entry._geoloc.lat;
    // distance in meters
    const distance = getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: entryLatitude, longitude: entryLongitude }
    );

    if (distance > 3500) {
      console.log("got", entry.name, "too far ", distance);
      continue;
    }
    // console.log("close enough", distance);
    if (venueNameMatched(term, entry.name) ||
      await resy_address_matched(entry.url_slug, entry.location.id, address)) {
      // console.log("name or address matched");
      if (await validateResyId(resy_id)) {
        return makeResult(entry);
      }
    }
    console.log("neither name nor address matched, passing", term, entry.name);
  }
  return null;
}

async function resy_address_matched(url_slug, location_id, address) {
  const location = await resy_find_location_details(url_slug, location_id);
  if (location) {
    return addressMatch(
      location.address_1,
      address,
      location.locality,
      location.region
    );
  }
  return false;
}

async function validateResyId(resy_id) {
  const calendar = await resy_calendar(resy_id, 2, "any", 30);
  return calendar.last_calendar_day !== null;
}

async function resy_basic_search(term, longitude, latitude) {
  try {
    const result =
      await fetch("https://api.resy.com/3/venuesearch/search", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "authorization": "ResyAPI api_key=\"VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5\"",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-origin": "https://resy.com",
          "Referer": "https://resy.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: JSON.stringify({
          geo: {
            longitude: longitude,
            latitude: latitude,
          },
          query: term,
          types: ["venue", "cuisine"],
        }),
        "method": "POST"
      });
    const json = await result.json();
    return json.search.hits;
  } catch (error) {
    console.log("resy_basic_search error", term, longitude, latitude);
    console.error(error);
  }
  return [];
}
async function resy_calendar(venue_id, num_seats, name, days_ahead) {
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
  return await resyAPIFetch(url);
}
exports.resy_calendar = resy_calendar;

async function process_for_resy(key, name, longitude, latitude, address) {
  const result = await resy_basic_search_and_validate(
    name,
    longitude,
    latitude,
    address
  );
  if (!result) {
    console.log(name, "opentable not found");
    return false;
  }
  console.log("resy found", result);
  await resy_set_venue_reservation(key, result.urlSlug, result.resyCityCode, result.businessid);
  return true;
}

exports.process_for_resy = process_for_resy;