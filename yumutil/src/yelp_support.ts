import { getDistance } from "geolib";
import { venueNameSimilar, addressMatch } from "./utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { resy_set_venue_reservation } from "./resy_support";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";

dayjs.extend(timezone);
dayjs.extend(utc);

interface YelpSuggestion {
  title: string;
  subtitle: string;
  redirectUrl: string;
}

interface YelpSearchResult {
  name: string;
  address: string;
  redirectUrl: string;
  slug: string;
}

interface YelpResponse {
  data: {
    searchSuggestFrontend: {
      prefetchSuggestions: {
        suggestions: YelpSuggestion[];
      };
    };
  };
}

export async function yelp_basic_search(searchTerm: string, city: string, state: string): Promise<YelpSearchResult[]> {
  try {
    const response = await fetch("https://www.yelp.com/gql/batch", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json",
      },
      "body": JSON.stringify([{
        operationName: "GetSuggestions",
        variables: {
          capabilities: [],
          prefix: searchTerm,
          location: `${city}, ${state}`
        },
        extensions: {
          operationType: "query",
          documentId: "109c8a7e92ee9b481268cf55e8e21cc8ce753f8bf6453ad42ca7c1652ea0535f"
        }
      }]),
      "method": "POST"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as [YelpResponse];
    const suggestions = data[0].data.searchSuggestFrontend.prefetchSuggestions.suggestions;
    const results = suggestions.map(suggestion => ({
      name: suggestion.title,
      address: suggestion.subtitle,
      redirectUrl: suggestion.redirectUrl,
      slug: suggestion.redirectUrl?.replace(/^\/biz\//, ""),
    }));

    return results.filter(result => result.slug);

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getYelpBusinessDetails(businessId: string): Promise<any> {
  const yelpToken = process.env.YELP_API_KEY;
  if (!yelpToken) {
    throw new Error('YELP_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${yelpToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Yelp business details, likely no such business:', error);
    return null;
  }
}

export async function yelp_basic_search_and_validate(
  term: string,
  longitude: number,
  latitude: number,
  address: string,
  city: string,
  state: string
): Promise<any | null> {

  const results = await yelp_basic_search(term, city, state);
  for (const entry of results) {
    const details = await getYelpBusinessDetails(entry.slug);
    if (!details) {
      continue;
    }

    const entryLongitude = details.coordinates.longitude;
    const entryLatitude = details.coordinates.latitude;

    // Calculate distance in meters between the target location and this business
    const distance = getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: entryLatitude, longitude: entryLongitude }
    );

    // If distance is more than 3.5km, skip this entry
    if (distance > 3500) {
      continue;
    }

    // Check if name matches and address matches
    if (venueNameSimilar(term, entry.name) &&
      await addressMatch(details.location.address1, address, details.location.city, details.location.state)) {
      // Check if the business has a reservation system
      try {
        const reservation_data = await yelp_find_reservation(entry.slug, details.id, longitude, latitude, dayjs().add(-1, 'day').format('YYYY-MM-DD'), 2, "dinner");
        if (reservation_data.availability_profile === "no_avail") {
          continue;
        }
      } catch (error) {
        console.error('Yelp Error finding reservation during validation:', error);
        continue;
      }
      return {
        name: entry.name,
        slug: entry.slug,
        businessid: details.id,
        address: details.location.address1,
        city: details.location.city,
        state: details.location.state
      };
    }
  }
}


export async function yelp_find_reservation(
  slug: string,
  businessid: string,
  longitude: number,
  latitude: number,
  date: string,
  party_size: number,
  timeOption: string,
): Promise<any> {
  let url = `https://www.yelp.com/reservations/${slug}/search_availability`;

  let datetime = (timeOption === "dinner") ? "19:00:00" : "12:00:00";

  let data = {
    append_request: "false",
    biz_id: businessid,
    biz_lat: latitude,
    biz_long: longitude,
    covers: party_size,
    date: date,
    days_after: 0,
    days_before: 0,
    num_results_after: 3,
    num_results_before: 3,
    search_type: "URL_INITIATE_SEARCH",
    time: datetime,
    weekly_search_enabled: "true",
  };

  // Convert data object to URLSearchParams
  const params = new URLSearchParams(data as any);
  const fullUrl = `${url}?${params.toString()}`;

  const response = await fetch(fullUrl, {
    headers: {
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  // const html = await response.text();
  // console.log(html);
  const res = await response.json();
  return res;
}


export async function process_for_yelp(
  saveChanges: boolean,
  key: string,
  name: string,
  longitude: number,
  latitude: number,
  address: string,
  city: string,
  state: string
): Promise<boolean> {
  const result = await yelp_basic_search_and_validate(
    name,
    longitude,
    latitude,
    address,
    city,
    state
  );
  if (!result) {
    return false;
  }
  if (saveChanges) {
    await yelp_set_venue_reservation(
      key,
      result.urlSlug,
      result.businessid
    );
  } else {
    console.log("found yelp venue but not saving ", result);
  }
  return true;
}

export async function yelp_set_venue_reservation(
  venue_key: string,
  urlSlug: string,
  businessid: string,
): Promise<void> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${urlSlug}",
    reservation: "yelp",
    businessid: "${businessid}",
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

export async function validateYelpVenueInfo(venue: any): Promise<boolean> {
  const yelp_entity = await getYelpBusinessDetails(venue.businessid);
  if (!yelp_entity) {
    return false;
  }
  if (!venueNameSimilar(venue.name, yelp_entity.name)) {
    return false;
  }
  if (!addressMatch(yelp_entity.location.address1, venue.address, yelp_entity.location.city, yelp_entity.location.state)) {
    return false;
  }
  const reservation_data = await yelp_find_reservation(venue.urlSlug, venue.businessid, venue.longitude, venue.latitude, dayjs().add(-1, 'day').format('YYYY-MM-DD'), 2, "dinner");
  if (reservation_data.availability_profile === "no_avail") {
    return false;
  }
  return true;
}
