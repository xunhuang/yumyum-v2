import { uspsLookupStreet } from './uspsLookupStreet';
import { yumyumGraphQLCall } from './yumyumGraphQLCall';
import dotenv from "dotenv";
const buildUrl = require('build-url');
var similarity = require('jaro-winkler');

dotenv.config();

const API_KEY = process.env.GOOGLE_CLOUD_API;

export function venueNameMatched(a: string, b: string): boolean {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b;
}


export function venueNameSimilar(name1: string, name2: string): boolean {
  const distance = similarity(name1, name2);
  if (distance > 0.9) {
    return true;
  }
  // names not exact or close... but still try to match substring 
  // as some names are "Sierra Mar" vs "Sierra Mar the bar"
  const normalized1 = name1.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
  const normalized2 = name2.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }

  return false;
}

export async function addressMatch(street_a: string, street_b: string, city: string, state: string): Promise<boolean> {

    if (!street_a || !street_b) {
        return false;
    }

    street_a = street_a.toLowerCase();
    street_b = street_b.toLowerCase();
    if (street_a === street_b) {
        return true;
    }

  if (venueNameSimilar(street_a, street_b)) {
    return true;
  }

    const usps_street_a = await uspsLookupStreet(street_a, city, state);
    const usps_street_b = await uspsLookupStreet(street_b, city, state);

  console.log(usps_street_a, usps_street_b, city, state);

    if (!usps_street_a || !usps_street_b) {
      const standardized_address_a = await get_standardized_US_address_from_google(street_a, city, state);
      const standardized_address_b = await get_standardized_US_address_from_google(street_b, city, state);
      console.log(standardized_address_a, standardized_address_b, city, state);
      if (!standardized_address_a || !standardized_address_b) {
        return false;
      }
      return standardized_address_a === standardized_address_b;
    }
    return usps_street_a === usps_street_b;
}


export async function simpleFetchGet(url: string): Promise<string> {
  const content = await fetch(url, {
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
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
  });

  const body = await content.text();
  return body;
}
export async function simpleFetchPost(url: string, body: any): Promise<string> {
  const content = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
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
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: body,
    method: "POST",
  });

  return await content.text();
}

export async function get_longlat_from_address(address: string, city: string, state: string) {

  const fullAddress = `${address}, ${city}, ${state}`;
  const baseurl = "https://maps.googleapis.com/maps/api/geocode/json";

  let reservationUrl = buildUrl(baseurl, {
    queryParams: {
      address: fullAddress,
      key: API_KEY,
    },
  });

  const json = await simpleFetchGet(reservationUrl);
  const result = JSON.parse(json).results[0].geometry.location;
  return result;
}

export async function setVenueGPS(venue_key: string, longitude: number, latitude: number): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    longitude: ${longitude}
    latitude: ${latitude}
  }, key: "${venue_key}"}) {
  venue {
    name
    key
  }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
} 

export async function get_standardized_US_address_from_google(address: string, city: string, state: string): Promise<string | undefined> {

  const baseurl = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${API_KEY}`
  const body = {
    "address": {
      "regionCode": "US",
      "addressLines": [address, city, state]
    },
  }

  const json = await simpleFetchPost(baseurl, JSON.stringify(body));
  const result = JSON.parse(json);
  if (result?.result?.address?.formattedAddress) {
    return result.result.address.formattedAddress;
  }
  console.log("Google search: No formatted address found for ", address, city, state);
  console.log("Result was", result);
  return undefined;
}


export async function GoogleFindPlaceFromText(input: string): Promise<any> {
  const baseurl = buildUrl('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
    queryParams: {
      input: input,
      inputtype: 'textquery',
      fields: 'formatted_address,name,rating,opening_hours,geometry,place_id,business_status',
      key: API_KEY
    }
  });
  const json = await simpleFetchGet(baseurl);
  return JSON.parse(json);
}

export async function get_google_place_details(place_id: string): Promise<any> {
  const baseurl = buildUrl('https://maps.googleapis.com/maps/api/place/details/json', {
    queryParams: {
      place_id: place_id,
      fields: 'name,reservable,formatted_phone_number',
      key: API_KEY
    }
  });
  const json = await simpleFetchGet(baseurl);
  return JSON.parse(json);
}


export async function GoogleIsThisPlaceClosed(name: string, address: string, city: string, state: string): Promise<any> {
  const searchTerm = `${name} ${address} ${city} ${state}`;
  const result = await GoogleFindPlaceFromText(searchTerm);
  console.log(result);
  if (result.candidates.length !== 1) {
    return undefined; // unsure
  }
  const status = result.candidates[0].business_status;
  if (status === 'CLOSED_TEMPORARILY') {
    // rarely a restuarant would come back alive... 
    return true;
  }
  if (status === 'CLOSED_PERMANENTLY') {
    return true;
  }

  const place_id = result.candidates[0].place_id;
  const details = await get_google_place_details(place_id);
  console.log(details);
  // if (details.result.reservable) {
  //   return false;
  // }
  return false;
}