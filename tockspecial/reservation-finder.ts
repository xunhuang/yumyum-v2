import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock,
  checkIfVenueIsClosedAndActOnIt,
  tock_support_shutdown
} from "yumutil";

(async function main(): Promise<void> {
  console.log("hello");

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    console.log(`${venue.name} - ${venue.address}`);
    const tock_found = await process_for_tock(venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
    if (tock_found) {
      continue;
    }
    const opentable_found = await process_for_opentable(venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    if (opentable_found) {
      continue;
    }
    const resy_found = await process_for_resy(venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    if (resy_found) {
      continue;
    }
    const closed = await checkIfVenueIsClosedAndActOnIt(venue.key, venue.name, venue.city, venue.region);
    if (closed) {
      continue;
    }
  }

  console.log("done");
  await tock_support_shutdown();
})();

async function BayAreaListWithTBD() {
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