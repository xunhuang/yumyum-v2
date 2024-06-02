const getDistance = require("geolib").getDistance;
exports.getDistance = getDistance;
const { buildUrl } = require("build-url");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const {
  opentable_set_venue_reservation,
  tock_set_venue_reservation,
} = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const { simpleFetchGet } = require("./resy_support");
const { resyAPILookupByVenueID } = require("./resy_support");
const { resultKeyNameFromField } = require("@apollo/client/utilities");
const { process_for_opentable } = require("./process_for_opentable");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log(v.name);
      const success = await process_for_opentable(
        v.key,
        v.name,
        v.longitude,
        v.latitude,
        v.address
      );
    }
  } catch (error) {
    console.error(error);
  }
})();


async function BayAreaListWithTBD() {
  // michelinobjectid: { isNull: false }
  // url: { startsWith: "https://guide.michelin.com" }
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
      close: { equalTo: false }
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


