import buildUrl from "build-url";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";
import { RateLimiter } from "limiter";
import dayjs from "dayjs";
import { getDistance } from "geolib";
import { addressMatch, venueNameSimilar } from "./utils";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 2000 });

export function resy_calendar_key(slug: string, party_size: number): string {
  return `resy-calendar-${slug}-${party_size}`;
}

export async function resyLists(): Promise<any> {
  const query = `
  query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"},
    reservation: {equalTo: "resy"},
    close:{equalTo:false}}
  ) {
nodes {
        name
        urlSlug
        businessid
        key
        longitude
        latitude
        address
        resyCityCode
        city
      }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}

export async function getVenueByKey(key: string): Promise<any> {
  const query = `
  query MyQuery {
  allVenues(
    filter: { key:{equalTo:"${key}"}}
  ) {
nodes {
        name
        urlSlug
        businessid
        key
        longitude
        latitude
        address
        resyCityCode
        city
      }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes[0];
}

export async function resyFindReservation(
  venue_id: string,
  date: string,
  party_size: number
): Promise<any> {
  const result = await resyAPIFetch(
    buildUrl("https://api.resy.com", {
      path: "4/find",
      queryParams: {
        lat: "0",
        long: "0",
        day: date,
        party_size: party_size.toString(),
        venue_id: venue_id,
      },
    })
  );
  return result;
}

export function resy_day_key(
  slug: string,
  date: string,
  party_size: number
): string {
  return `resy-${slug}-${date}-${party_size}`;
}

async function resy_find_location_details(
  slug: string,
  location: string
): Promise<any> {
  const result = await resyAPIFetch(
    buildUrl("https://api.resy.com", {
      path: "3/venue",
      queryParams: {
        url_slug: slug,
        location: location,
      },
    })
  );
  return result?.location;
}

export async function resy_set_venue_to_tbd(venue_key: string): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    reservation: "TBD"
    withOnlineReservation: "true",
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

export async function resy_set_venue_reservation(
  venue_key: string,
  slug: string,
  resycityCode: string,
  venue_id: string
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${slug}",
    reservation: "resy",
    businessid: "${venue_id}",
    resyCityCode: "${resycityCode}",
    withOnlineReservation: "true",
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

// async function resyAPIFetch(url: string): Promise<any> {
//   await limiter.removeTokens(1);
//   const response = await fetch(url, {
//     headers: {
//       accept: "application/json, text/plain, */*",
//       authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
//       "cache-control": "no-cache",
//       "sec-ch-ua":
//         '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"macOS"',
//       "x-origin": "https://resy.com",
//       "user-agent":
//         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
//     },
//     referrer: "https://resy.com/",
//     referrerPolicy: "strict-origin-when-cross-origin",
//     body: undefined,
//     method: "GET",
//     mode: "cors",
//     credentials: "include",
//   });

//   if (response.status !== 200) {
//     console.log("resyAPIFetch error", url, response.status);
//     return null;
//   }

//   try {
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.log("resyAPIFetch error", url, response.status);
//     return null;
//   }
// }

const proxylist = [
  "38.153.152.244:9594:twdstpvx:sgawibu43v6a",
  "86.38.234.176:6630:twdstpvx:sgawibu43v6a",
  "173.211.0.148:6641:twdstpvx:sgawibu43v6a",
  "161.123.152.115:6360:twdstpvx:sgawibu43v6a",
  "216.10.27.159:6837:twdstpvx:sgawibu43v6a",
  "154.36.110.199:6853:twdstpvx:sgawibu43v6a",
  "45.151.162.198:6600:twdstpvx:sgawibu43v6a",
  "185.199.229.156:7492:twdstpvx:sgawibu43v6a",
  "185.199.228.220:7300:twdstpvx:sgawibu43v6a",
  "185.199.231.45:8382:twdstpvx:sgawibu43v6a",
];

async function resyAPIFetch(url: string): Promise<any> {
  await limiter.removeTokens(1);
  const random = proxylist[Math.floor(Math.random() * proxylist.length)];
  const [host, port, username, password] = random.split(":");
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;
  console.log("proxyUrl", proxyUrl);
  const agent = new HttpsProxyAgent(proxyUrl);

  const response = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "cache-control": "no-cache",
      "sec-ch-ua":
        '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "x-origin": "https://resy.com",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    // referrer: "https://resy.com/",
    // referrerPolicy: "strict-origin-when-cross-origin",
    // body: null,
    method: "GET",
    // mode: "cors",
    // credentials: "include",
    agent: agent
  });
  if (response.status !== 200) {
    console.log("resyAPIFetch error", url, response.status);
    return null;
  }

  try {
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("resyAPIFetch error", url, response.status);
    return null;
  }
}

export async function resyAPILookupByVenueID(venue_id: string): Promise<any> {
  // this API call is problematic as
  // if a venue is not available *TODAY*, it will actually get 500 error
  // need a better alternative
  const url = buildUrl("https://api.resy.com", {
    path: "4/find",
    queryParams: {
      long: "0",
      lat: "0",
      venue_id: venue_id,
      party_size: "2",
      day: dayjs().format("YYYY-MM-DD"),
    },
  });
  return await resyAPIFetch(url);
}
export async function resyAPILookupByVenueID2(
  url_slug: string,
  location_id: string
): Promise<any> {
  const url = buildUrl("https://api.resy.com", {
    path: "3/venue",
    queryParams: {
      url_slug: url_slug,
      location: location_id,
    },
  });
  return await resyAPIFetch(url);
}

export async function resyAPILookupByVenueID3(venue_id: string): Promise<any> {
  const url = buildUrl("https://api.resy.com", {
    path: "2/config",
    queryParams: {
      long: "0",
      lat: "0",
      venue_id: venue_id,
      party_size: "2",
      day: dayjs().format("YYYY-MM-DD"),
    },
  });
  return await resyAPIFetch(url);
}

export async function resy_basic_search_and_validate(
  term: string,
  longitude: number,
  latitude: number,
  address: string
): Promise<any | null> {
  const makeResult = (entry: any) => {
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
    const resy_id = entry.id.resy;
    const entryLongitude = entry._geoloc.lng;
    const entryLatitude = entry._geoloc.lat;
    // distance in meters
    const distance = getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: entryLatitude, longitude: entryLongitude }
    );

    if (distance > 3500) {
      continue;
    }

    if (
      venueNameSimilar(term, entry.name) ||
      (await resy_address_matched(entry.url_slug, entry.location.id, address))
    ) {
      if (await validateResyId(resy_id)) {
        return makeResult(entry);
      }
    }
  }
  return null;
}

async function resy_address_matched(
  url_slug: string,
  location_id: string,
  address: string
): Promise<boolean> {
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

async function validateResyId(resy_id: string): Promise<boolean> {
  const calendar = await resy_calendar(resy_id, 2, "any", 30);
  return calendar && calendar.last_calendar_day !== null;
}

async function resy_basic_search(
  term: string,
  longitude: number,
  latitude: number
): Promise<any[]> {
  try {
    const result = await fetch("https://api.resy.com/3/venuesearch/search", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
        "cache-control": "no-cache",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-origin": "https://resy.com",
        Referer: "https://resy.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        geo: {
          longitude: longitude,
          latitude: latitude,
        },
        query: term,
        types: ["venue", "cuisine"],
      }),
      method: "POST",
    });
    const json = await result.json();
    return json.search.hits;
  } catch (error) {
    console.log("resy_basic_search error", term, longitude, latitude);
    console.error(error);
  }
  return [];
}
export async function resy_calendar(
  venue_id: string,
  num_seats: number,
  name: string,
  days_ahead: number
): Promise<any> {
  const today = dayjs().add(-1, "days").format("YYYY-MM-DD");
  const enddate = dayjs().add(days_ahead, "days").format("YYYY-MM-DD");

  const url = buildUrl("https://api.resy.com", {
    path: "4/venue/calendar",
    queryParams: {
      venue_id: venue_id,
      num_seats: num_seats.toString(),
      start_date: today,
      end_date: enddate,
    },
  });
  return await resyAPIFetch(url);
}

export async function process_for_resy(
  saveChanges: boolean,
  key: string,
  name: string,
  longitude: number,
  latitude: number,
  address: string
): Promise<boolean> {
  const result = await resy_basic_search_and_validate(
    name,
    longitude,
    latitude,
    address
  );
  if (!result) {
    return false;
  }
  if (saveChanges) {
    await resy_set_venue_reservation(
      key,
      result.urlSlug,
      result.resyCityCode,
      result.businessid
    );
  }
  return true;
}

async function getKeyInfoByResyVenueID(businessid: string): Promise<any> {
  const result = await resyAPILookupByVenueID(businessid);
  if (!result || result.results.venues.length === 0) {
    return null;
  }

  const venue = result.results.venues[0];
  const response = {
    longitude: venue.venue.location.geo.lon,
    latitude: venue.venue.location.geo.lat,
    name: venue.venue.name,
    groupname: venue.venue.venue_group.name,
    url_slug: venue.venue.url_slug,
    resyCityCode: venue.venue.location.code,
    city: venue.venue.location.name,
  };
  return response;
}
async function getKeyInfoByResyVenueID2(
  urlslug: string,
  location_id: string
): Promise<any> {
  const result = await resyAPILookupByVenueID2(urlslug, location_id);
  if (!result) {
    return null;
  }

  const venue = result;
  const response = {
    longitude: venue.location.longitude,
    latitude: venue.location.latitude,
    name: venue.name,
    groupname: venue.venue_group.name,
    url_slug: venue.url_slug,
    resyCityCode: venue.location.code,
    city: venue.location.locality,
    businessid: venue.id.resy.toString(),
  };
  return response;
}

async function checkIsValidlityByResyVenueIdLookup(
  venue: any
): Promise<boolean> {
  let result = await getKeyInfoByResyVenueID(venue.businessid);
  // const result = await getKeyInfoByResyVenueID2(item.businessid, item.resyCityCode);
  // let result = await getKeyInfoByResyVenueID2(item.urlSlug, "san-francisco-ca");

  if (result && venue.urlSlug === result.url_slug) {
    return true;
  }

  if (result) {
  } else {
    result = await getKeyInfoByResyVenueID2(venue.urlSlug, "san-francisco-ca");
    if (!result) {
      return false;
    }
    if (venue.businessid !== result.businessid) {
      return false;
    }
  }

  const physicaldistance = getDistance(
    { latitude: venue.latitude, longitude: venue.longitude },
    { latitude: result.latitude, longitude: result.longitude }
  );

  if (physicaldistance > 100000) {
    // 10Km istoo far away
    return false;
  }

  if (venueNameSimilar(venue.name, result.name)) {
    return true;
  }
  if (venueNameSimilar(venue.name, result.groupname)) {
    return true;
  }

  return false;
}

export async function validateResyVenueInfo(venue: any): Promise<boolean> {
  console.log(
    "validateResyVenueInfo *******************************************",
    venue.name
  );
  const valid = await checkIsValidlityByResyVenueIdLookup(venue);
  if (!valid) {
    return false;
  }
  const calendar = await resy_calendar(venue.businessid, 2, venue.name, 30);
  if (calendar && calendar.last_calendar_day !== null) {
  } else {
    return false;
  }
  return true;
}
