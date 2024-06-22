import cheerio from "cheerio";
import dayjs from "dayjs";
import { yumyumGraphQLCall } from "./yumyumGraphQLCall";
import { addressMatch, venueNameSimilar } from "./utils";
import { getDistance } from "geolib";

interface Entry {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface AppConfig {
  restaurant?: {
    address?: {
      line1: string;
      city: string;
      state: string;
    };
    name?: string;
  };
  authToken?: string;
}

export async function validateOpentableVenueInfo(venue: any): Promise<boolean> {
  const appconfig = await opentable_fetchAppConfig(venue.businessid);
  if (!appconfig?.restaurant?.name) {
    console.log("No restaurant name found for ", venue.name);
    return false;
  }
  if (!venueNameSimilar(venue.name, appconfig.restaurant.name)) {
    console.log("restaurant name not similar for ", venue.name, appconfig.restaurant.name);
    return false;
  }
  return await validateOpentableId(venue.businessid);
}

export async function opentable_set_venue_reservation(
  venue_key: string,
  businessid: string
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    reservation: "opentable",
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

async function process_for_opentable(
  saveChanges: boolean,
  key: string,
  name: string,
  longitude: number,
  latitude: number,
  address: string
): Promise<boolean> {
  const opentable_id = await opentable_basic_search_and_validate(
    name,
    longitude,
    latitude,
    address
  );
  if (!opentable_id) {
    console.log(name, "opentable not found");
    return false;
  }
  console.log(name, "Opentable found a match ---------------- ", opentable_id);
  if (saveChanges) {
    await opentable_set_venue_reservation(key, opentable_id);
  }
  return true;
}
export { process_for_opentable };

async function opentable_basic_search_and_validate(
  term: string,
  longitude: number,
  latitude: number,
  address: string
): Promise<string | null> {
  const result = await opentable_basic_search(term, longitude, latitude);

  for (const entry of result) {
    const opentable_id = entry.id;

    console.log(entry)
    console.log(longitude, latitude);
    console.log(address);

    // distance in meters
    const distance = getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: entry.latitude, longitude: entry.longitude }
    );

    if (distance > 3500) {
      console.log("got", entry.name, "too far ", distance);
      continue;
    }

    console.log("close enough", distance);

    if (venueNameSimilar(term, entry.name)) {
      console.log("name matched for ", term, entry.name);
      if (await validateOpentableId(opentable_id)) {
        return opentable_id;
      }
    }
    console.log("name not matched for ", term, entry.name);

    // maybe check address
    const appConfig = await opentable_fetchAppConfig(opentable_id);
    console.log(appConfig?.restaurant?.address);
    const location = appConfig?.restaurant?.address;
    if (location) {
      if (
        await addressMatch(
          location.line1,
          address,
          location.city,
          location.state
        )
      ) {
        console.log("Address matched for ", term, entry.name);
        if (await validateOpentableId(opentable_id)) {
          return opentable_id;
        }
      }
    }
  }

  return null;
}

async function opentable_basic_search(
  term: string,
  longitude: number,
  latitude: number
): Promise<Entry[]> {
  try {
    const result = await fetch(
      "https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete",
      {
        headers: {
          "content-type": "application/json",
          "x-csrf-token": "eda2a880-4591-44e3-b7e0-9f7f03079bd3",
        },
        body: JSON.stringify({
          operationName: "Autocomplete",
          variables: {
            term: term,
            latitude: latitude || 37.7682494,
            longitude: longitude || -122.4216544,
            useNewVersion: true,
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash:
                "fe1d118abd4c227750693027c2414d43014c2493f64f49bcef5a65274ce9c3c3",
            },
          },
        }),
        method: "POST",
      }
    );
    const json = await result.json();
    const resultlist = json.data.autocomplete?.autocompleteResults;
    return resultlist;
  } catch (error) {
    console.log("opentable_basic_search error", term, longitude, latitude);
    console.error(error);
  }
  return [];
}

async function opentable_fetchAppConfig(
  businessid: string
): Promise<AppConfig | undefined> {
  let url = `https://www.opentable.com/restref/client?rid=${businessid}&restref=${businessid}`;
  const w = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  const res = await w.text();
  const $ = cheerio.load(res);

  let scripts = $("#client-initial-state").html();
  if (!scripts) {
    console.log("no scripts found for ", url);
    // no config
    return undefined;
  }
  try {
    let appconfig = JSON.parse(scripts);
    return appconfig;
  } catch (error) {
    console.log("opentable_fetchAppConfig error", businessid);
    console.error(error);
  }
  return undefined;
}

async function validateOpentableId(opentable_id: string): Promise<boolean> {
  const sevenDaysFromNow = dayjs().add(7, "day").format("YYYY-MM-DD");
  const result = await opentable_reservation_search(
    opentable_id,
    sevenDaysFromNow,
    2,
    "dinner"
  );
  if (!result.availability) {
    console.log("opentable No longer available/functional when validating", opentable_id);
    return false;
  }
  if (result.availability?.error?.message === "NOT_AVAILABLE") {
    console.log("opentable No longer available/functional when validating", opentable_id);
    return false;
  }
  return true;
}
var opentable_auth_token: string | null = null;

async function fetchAuthToken(): Promise<string> {
  if (opentable_auth_token) {
    return opentable_auth_token;
  }

  let config = await opentable_fetchAppConfig("1477");
  if (!config || !config["authToken"]) {
    throw new Error("Unable to fetch auth token for opentable");
  }
  opentable_auth_token = config["authToken"];
  return opentable_auth_token!;
}

async function opentable_reservation_search(
  businessid: string,
  date: string,
  party_size: number,
  timeOption: string
): Promise<any> {
  let token = await fetchAuthToken();
  let url = "https://www.opentable.com/restref/api/availability?lang=en-US";
  let datetime =
    timeOption === "dinner" ? date + "T19:00:00" : date + "T12:00:00";
  let data = {
    rid: businessid,
    partySize: party_size,
    dateTime: datetime,
    enableFutureAvailability: false,
  };
  const w = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
    },
  });

  const json = await w.json();
  return json;
}
