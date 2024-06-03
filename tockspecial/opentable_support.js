const cheerio = require("cheerio");
const dayjs = require("dayjs");
const { venueNameMatched, addressMatch } = require("./util");
const { getDistance } = require("./reservation-finder");
const { opentable_set_venue_reservation } = require("./resy_support");


async function process_for_opentable(key, name, longitude, latitude, address) {
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
  console.log(name, "opentable found YYYYYYYYY", opentable_id);
  await opentable_set_venue_reservation(key, opentable_id);
  return true;
}
exports.process_for_opentable = process_for_opentable;

async function opentable_basic_search_and_validate(
  term,
  longitude,
  latitude,
  address
) {
  const result = await opentable_basic_search(term, longitude, latitude);

  for (const entry of result) {
    const opentable_id = entry.id;
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

    if (venueNameMatched(term, entry.name)) {
      console.log("name matched");
      if (await validateOpentableId(opentable_id)) {
        return opentable_id;
      }
    } else {
      console.log("name did not match", term, entry.name);
    }

    // maybe check address
    const appConfig = await opentable_fetchAppConfig(opentable_id);
    console.log(appConfig?.restaurant?.address);
    const location = appConfig?.restaurant?.address;
    if (location) {
      if (await addressMatch(
        location.line1,
        address,
        location.city,
        location.state
      )) {
        console.log("XXXXX Address matched");
        if (await validateOpentableId(opentable_id)) {
          return opentable_id;
        }
      }
    }
  }

  return null;
}

async function opentable_basic_search(term, longitude, latitude) {
  try {
    const result = await fetch(
      "https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete",
      {
        headers: {
          // don't uncomment this.... it will fail
          // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
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
              // needs updating
              sha256Hash: "fe1d118abd4c227750693027c2414d43014c2493f64f49bcef5a65274ce9c3c3",
            },
          },
        }),
        method: "POST",
      }
    );
    const json = await result.json();
    console.log(json);
    const resultlist = json.data.autocomplete?.autocompleteResults;
    return resultlist;
  } catch (error) {
    console.log("opentable_basic_search error", term, longitude, latitude);
    console.error(error);
  }
  return [];

}


async function opentable_fetchAppConfig(businessid) {
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
  let appconfig = JSON.parse(scripts);
  return appconfig;
}

async function validateOpentableId(opentable_id) {
  const sevenDaysFromNow = dayjs().add(7, "day").format("YYYY-MM-DD");
  const result = await opentable_reservation_search(
    opentable_id,
    sevenDaysFromNow,
    2,
    "dinner"
  );
  // console.log(result);
  if (!result.availability) {
    console.log("opentable No longer available", opentable_id);
    return false;
  }
  if (result.availability?.error?.message === "NOT_AVAILABLE") {
    console.log("opentable No longer available", opentable_id);
    return false;
  }
  return true;
}
var opentable_auth_token = null;

async function fetchAuthToken() {
  if (opentable_auth_token) {
    return opentable_auth_token;
  }

  let config = await opentable_fetchAppConfig(1477);
  opentable_auth_token = config["authToken"];
  return opentable_auth_token;
}

async function opentable_reservation_search(
  businessid,
  date,
  party_size,
  timeOption
) {
  let token = await fetchAuthToken();
  let url = "https://www.opentable.com/restref/api/availability?lang=en-US";
  let datetime = timeOption === "dinner" ? date + "T19:00:00" : date + "T12:00:00";
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
