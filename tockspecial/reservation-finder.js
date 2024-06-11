const getDistance = require("geolib").getDistance;
exports.getDistance = getDistance;
require("dotenv").config();

const { yumyumGraphQLCall } = require("yumutil");

const {
  checkIfVenueIsClosedAndActOnIt,
} = require("./checkIfVenueIsClosedAndActOnIt.ts");
const { process_for_opentable } = require("./opentable_support");
const { process_for_resy } = require("./resy_support");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    // for (let v of bayAreaList.filter((v) => v.name.includes("16"))) {
    for (let v of bayAreaList) {
      console.log(v);
      // await checkIfVenueIsClosedAndActOnIt(v.key, v.name, v.city, v.region);
      // await process_for_opentable(v.key, v.name, v.longitude, v.latitude, v.address);
      const l = await process_for_resy(
        v.key,
        v.name,
        v.longitude,
        v.latitude,
        v.address
      );
      console.log(l);
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
      city
      region
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
