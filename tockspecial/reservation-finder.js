const cheerio = require("cheerio");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { opentable_set_venue_reservation, tock_set_venue_reservation } = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const { simpleFetchGet } = require("./resy_support");
const { resyAPILookupByVenueID } = require("./resy_support");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log(v.name);
      const opentable_result = await opentable_basic_search_and_validate(v.name, v.longitude, v.latitude);
      console.log(opentable_result);
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


async function opentable_basic_search_and_validate(term, longitude, latitude) {

  const result = await opentable_basic_search(term, longitude, latitude);
  return result;
}

async function opentable_basic_search(term, longitude, latitude) {
  // note that this is the built-in version and not the same as the node-fetch API
  const result = await fetch("https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete", {
    "headers": {
      // don't uncomment this.... it will fail 
      // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      "content-type": "application/json",
      "x-csrf-token": "eda2a880-4591-44e3-b7e0-9f7f03079bd3",
    },
    "body": JSON.stringify(
      {
        operationName: "Autocomplete",
        variables: {
          term: term,
          latitude: latitude,
          longitude: longitude,
          useNewVersion: true
        },
        extensions: {
          persistedQuery: {
            version: 1,
            // needs updating
            sha256Hash: "fe1d118abd4c227750693027c2414d43014c2493f64f49bcef5a65274ce9c3c3"
          }
        }
      }
    ),
    "method": "POST",
  });

  return await result.json();
}

