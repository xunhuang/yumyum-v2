import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock,
  checkIfVenueIsClosedAndActOnIt,
  tock_support_shutdown,
} from "yumutil";

(async function main(): Promise<void> {
  console.log("hello");

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    const saveChanges = false;
    console.log(`${venue.name} - ${venue.address}`);
    const tock_found = await process_for_tock(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
    if (tock_found) {
      if (venue.reservation !== "tock") {
        console.log(` need to update ----------------- ${venue.name} - to tock`);
      }
      continue;
    }
    const opentable_found = await process_for_opentable(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    if (opentable_found) {
      if (venue.reservation !== "opentable") {
        console.log(` need to update ----------------- ${venue.name} - to opentable`);
      }
      continue;
    }
    const resy_found = await process_for_resy(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    if (resy_found) {
      if (venue.reservation !== "resy") {
        console.log(` need to update ----------------- ${venue.name} - to resy`);
      }
      continue;
    }
    // const closed = await checkIfVenueIsClosedAndActOnIt(venue.key, venue.name, venue.city, venue.region);
    // if (closed) {
    //   continue;
    // }
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
      reservation
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}