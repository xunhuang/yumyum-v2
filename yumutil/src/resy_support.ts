import buildUrl from "build-url";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";
import { RateLimiter } from "limiter";
import dayjs from "dayjs";
import { getDistance } from "geolib";
import { addressMatch, venueNameSimilar } from "./utils";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 3000 });

export function resy_calendar_key(slug: string, party_size: number): string {
  return `resy-calendar-${slug}-${party_size}`;
}

export async function resyLists(): Promise<any> {
  // name: { equalTo: "Delage" },
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

export async function newFindReservation(
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
        // location: "mrn",
      },
    })
  );
  console.log("slug -------------------------------");
  // console.log("location", location);
  // console.log(result);
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

async function resyAPIFetch(url: string): Promise<any> {
  await limiter.removeTokens(1);
  const response = await fetch(url, {
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
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    referrer: "https://resy.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
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
export async function resyAPILookupByVenueID2(url_slug: string, location_id: string): Promise<any> {
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
    console.log("checking", entry.name);

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

    console.log("got", entry.name, "close enough", distance);
    if (
      venueNameSimilar(term, entry.name) ||
      (await resy_address_matched(entry.url_slug, entry.location.id, address))
    ) {
      console.log('validating', resy_id);
      if (await validateResyId(resy_id)) {
        console.log('validated', resy_id);
        return makeResult(entry);
      }
    }
    console.log("neither name nor address matched, passing", term, entry.name);
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
    console.log("location", location.address_1);
    console.log("compared to location", address);
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
  console.log("calendar", calendar);
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
    console.log(name, "resy not found");
    return false;
  }
  console.log("resy found", result);
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

// This file is to validate existing Resy venue to make sure they are still current.  
// Many reason why a venue would not be current
//   - going out of business
//   - switched platforms
//   - manual/earlier mistakes
// 
// Other changes can occur over time: resy urlslug may change, resy city code may change
// 
// Method for determination
//  1. search: if I perform a search and can identify the same place. 
//         however a search may failed for many reasons (name mismatched (Angler vs Angler'SF), wrong 
//         long/lat, wrong street name, or failed usps API etc.
//  2. if a venue ID's calendar call fails --> bad
//  3. if a venue ID's find reservation call fails --> bad
//  4. Lookup by venue ID, same location --> good
//              this returns long/lat, but not address
//              this return name, and veneu_group name 
// 
// main logic
//      if (lookupbyID is bad) ==> definitely bad 
//      if (lookupbyID is good)
//         if (calendar_call is bad) ==> bad
//                   (need to sure the call succeceed with a legit json)
//         if (reservation finder is bad) ==> bad
//                   (need to sure the call succeceed with a legit json)
// do we need search then???

async function getKeyInfoByResyVenueID(businessid: string): Promise<any> {
  const result = await resyAPILookupByVenueID(businessid);
  // console.log(result);
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
  }
  return response;
}
async function getKeyInfoByResyVenueID2(urlslug: string, location_id: string): Promise<any> {
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
  }
  return response;
}

async function checkIsValidlityByResyVenueIdLookup(venue: any): Promise<boolean> {
  let result = await getKeyInfoByResyVenueID(venue.businessid);
  // const result = await getKeyInfoByResyVenueID2(item.businessid, item.resyCityCode);
  // let result = await getKeyInfoByResyVenueID2(item.urlSlug, "san-francisco-ca");

  if (result && venue.urlSlug === result.url_slug) {
    // same slug ---- good, who would use other's companie's slug?
    console.log("same slug ******************************", venue.name);
    return true;
  }

  if (result) {
    // slug is not matching..... 
    console.log("slug is not matching ******************************", venue.urlSlug, result.url_slug);
    // needs to update the slugs and city code.. 
    // XXX TODO...
    // but continue.... 
  } else {
    result = await getKeyInfoByResyVenueID2(venue.urlSlug, "san-francisco-ca");
    if (!result) {
      console.log("no result after 2 searches ****************** for", venue);
      return false;
    }
    if (venue.businessid !== result.businessid) {
      console.log("business id is not the same ******************", venue.businessid, result.businessid);
      // XXX TODO...
      return false;
    }
    // continue..... 
  }

  const physicaldistance = getDistance(
    { latitude: venue.latitude, longitude: venue.longitude },
    { latitude: result.latitude, longitude: result.longitude }
  );

  if (physicaldistance > 100000) {
    // 10Km istoo far away
    console.log("way too far ", venue.name, physicaldistance);
    return false;
  }

  if (venueNameSimilar(venue.name, result.name)) {
    console.log("name similar ", venue.name, result.name);
    return true;
  }
  if (venueNameSimilar(venue.name, result.groupname)) {
    console.log("group name similar ", venue.name, result.groupname);
    return true;
  }

  return false;
}

export async function validateResyVenueInfo(venue: any): Promise<boolean> {
  const valid = await checkIsValidlityByResyVenueIdLookup(venue);
  if (!valid) {
    console.log("BADBADBAD ******************", venue.name);
    return false;
  }
  const calendar = await resy_calendar(venue.businessid, 2, venue.name, 30);
  if (calendar && calendar.last_calendar_day !== null) {
    console.log("good ******************", venue.name);
  } else {
    console.log("bad ******************", venue.name);
    return false;
  }
  return true;
}