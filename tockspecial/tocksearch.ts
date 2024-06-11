import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock
} from "yumutil";

(async function main(): Promise<void> {
  console.log("hello");

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    console.log(`${venue.name} - ${venue.address}`);
    const tock_result = await process_for_tock(venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
    // const opentable_result = await process_for_opentable(venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    // const resy_result = await process_for_resy(venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
  }
  console.log("done");
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