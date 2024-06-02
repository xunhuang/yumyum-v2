const cheerio = require("cheerio");
const getDistance = require("geolib").getDistance;
const { buildUrl } = require("build-url");
const USPS = require("usps-webtools");
const dayjs = require("dayjs");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const {
  opentable_set_venue_reservation,
  tock_set_venue_reservation,
} = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const { simpleFetchGet } = require("./resy_support");
const { resyAPILookupByVenueID } = require("./resy_support");
const { resultKeyNameFromField } = require("@apollo/client/utilities");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log(v.name);
      const opentable_id = await opentable_basic_search_and_validate(
        v.name,
        v.longitude,
        v.latitude,
        v.address
      );
      console.log(v.name, "opentable found", opentable_id);
      if (opentable_id) {
        // await opentable_set_venue_reservation(v.key, opentable_id);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
      close: { equalTo: false }
      michelinobjectid: { isNull: false }
      url: { startsWith: "https://guide.michelin.com" }
    }
  ) {
    totalCount
    nodes {
      name
      address
      urlSlug
      key
      michelinslug
      michelinId
      url
      realurl
      michelinobjectid
      tags
      michelineOnlineReservation
      longitude
      latitude
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}

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
      console.log(
        "searching for",
        term,
        "got",
        entry.name,
        "too far ",
        distance
      );
      continue;
    }

    console.log("close enough", distance);

    if (venueNameMatched(term, entry.name)) {
      console.log("name matched");
      if (await validateResult(opentable_id)) {
        return opentable_id;
      }
    } else {
      console.log("name did not match", term, entry.name);
    }

    // maybe check address

    const appConfig = await _APIfetchAppConfig(entry.id);
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
        console.log("XXXXX Address matched");
        if (await validateResult(entry.id)) {
          return opentable_id;
        }
      }
    }
    // if (
    //   location &&
    //   (await addressMatch(
    //     location.address,
    //     extra.address,
    //     location.city,
    //     location.state
    //   ))
    // ) {
    //   if (await validateResult(entry.id)) {
    //     return makeResult(entry);
    //   }
    // }
  }

  return null;
}

async function opentable_basic_search(term, longitude, latitude) {
  // note that this is the built-in version and not the same as the node-fetch API
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
          latitude: latitude,
          longitude: longitude,
          useNewVersion: true,
        },
        extensions: {
          persistedQuery: {
            version: 1,
            // needs updating
            sha256Hash:
              "fe1d118abd4c227750693027c2414d43014c2493f64f49bcef5a65274ce9c3c3",
          },
        },
      }),
      method: "POST",
    }
  );

  const json = await result.json();
  const resultlist = json.data.autocomplete.autocompleteResults;
  return resultlist;
}
function venueNameMatched(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a === b;
}

async function _APIfetchAppConfig(businessid) {
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

async function validateResult(opentable_id) {
  const sevenDaysFromNow = dayjs().add(7, "day").format("YYYY-MM-DD");
  const result = await opentable_reservation_search(
    opentable_id,
    sevenDaysFromNow,
    2,
    "dinner"
  );
  // console.log(result);

  if (!result.availability) {
    console.log("opentable No longer available", businessid);
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

  let config = await _APIfetchAppConfig(1477);
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

async function addressMatch(street_a, street_b, city, state) {
  if (!street_a || !street_b) {
    return false;
  }

  street_a = street_a.toLowerCase();
  street_b = street_b.toLowerCase();
  if (street_a === street_b) {
    return true;
  }

  const usps_street_a = await uspsLookupStreet(street_a, city, state);
  const usps_street_b = await uspsLookupStreet(street_b, city, state);

  if (!usps_street_a || !usps_street_b) {
    return false;
  }
  return usps_street_a === usps_street_b;
}

const usps = new USPS({
  server: "http://production.shippingapis.com/ShippingAPI.dll",
  userId: "638XUNHU2733",
  ttl: 10000, //TTL in milliseconds for request
});

async function uspsLookupStreet(street1, city, state) {
  return new Promise((resolve, reject) => {
    let fixedState = state;
    if (fixedState === "New York State") {
      fixedState = "NY";
    }

    usps.verify(
      {
        street1: street1,
        // street2: 'Apt 2',
        city: city,
        state: fixedState,
      },
      function (err, address) {
        // if (!address?.street1) {
        //   console.log("uspsLookupStreet: no address found for " + street1 + ", " + city + ", " + fixedState);
        // }

        resolve(address?.street1);
      }
    );
  });
}
