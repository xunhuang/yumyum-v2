import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock,
  checkIfVenueIsClosedAndActOnIt,
  tock_support_shutdown,
  validateResyVenueInfo,
  validateTockVenueInfo,
} from "yumutil";

async function is_this_tock(venue: any): Promise<boolean> {
  // const found = await process_for_tock(false, venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
  const found = await process_for_tock(true, venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
  if (found) {
    return true;
  }
  // not found via search, let's use existing info to see 
  // if it's still tock, functional and same name given the same tock slug
  if (venue.reservation === "tock") {
    return await validateTockVenueInfo(venue);
  }
  return false;
}
async function is_this_opentable(venue: any): Promise<boolean> {
  return await process_for_opentable(false, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
}
async function is_this_resy(venue: any): Promise<boolean> {
  // first try to find the venue by the name/address/slug via the search system
  const found = await process_for_resy(false, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
  if (found) {
    return true;
  }
  // if the venue is already resy(per input), then we need to validate the venue info
  // by directly fetching the info via business id/slug and see if it matches
  if (venue.reservation === "resy") {
    return validateResyVenueInfo(venue);
  }
  return false;
}
async function is_this_closed(venue: any): Promise<boolean> {
  return await checkIfVenueIsClosedAndActOnIt(false, venue.key, venue.name, venue.city, venue.region);
}
async function is_this_tbd(venue: any): Promise<boolean> {
  return false;
}

async function whichReservationSystemIsthis(venue: any): Promise<string | null> {
  for (const key in functionMap) {
    const func = functionMap[key];
    const found = await func(venue);
    if (found) {
      return key;
    }
  }
  return null;
}

const functionMap: { [key: string]: (venue: any) => Promise<boolean> } = {
  tock: is_this_tock,
  opentable: is_this_opentable,
  resy: is_this_resy,
  closed: is_this_closed,
  TBD: is_this_tbd,
};

(async function main(): Promise<void> {
  console.log("hello");

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    const saveChanges = false;
    console.log(`Searching for ${venue.name} - ${venue.address} ****************************************************************`);
    const reservation = venue.reservation;
    const func = functionMap[reservation];
    if (func) {
      const found = await func(venue);
      if (found) {
        console.log(`Found ${reservation} for ${venue.name} MATCHING ++++++++++++++++++++++++++++++++++`);
      } else {
        console.log(`Found ${reservation} for ${venue.name} NOT MATCHING XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`);
        const which = await whichReservationSystemIsthis(venue);
        if (which) {
          console.log(` need to update ----------------- ${venue.name} -  should be to ${which}  YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`);
        }
      }
    }
    // // const tock_found = await process_for_tock(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address, venue.city, venue.region);
    // // if (tock_found) {
    // //   if (venue.reservation !== "tock") {
    // //     console.log(` need to update ----------------- ${venue.name} - to tock`);
    // //   }
    // //   continue;
    // }
    // const opentable_found = await process_for_opentable(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    // if (opentable_found) {
    //   if (venue.reservation !== "opentable") {
    //     console.log(` need to update ----------------- ${venue.name} - to opentable`);
    //   }
    //   continue;
    // }
    // const resy_found = await process_for_resy(saveChanges, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
    // if (resy_found) {
    //   if (venue.reservation !== "resy") {
    //     console.log(` need to update ----------------- ${venue.name} - to resy`);
    //   }
    //   continue;
    // }
    // const closed = await checkIfVenueIsClosedAndActOnIt(saveChanges, venue.key, venue.name, venue.city, venue.region);
    // if (closed) {
    //   console.log(` need to update restorant to closed`);
    //   continue;
    // }
  }

  console.log("done");
  await tock_support_shutdown();
})();
// name: { equalTo: "Noosh" }
//  name: { equalTo: "Auberge du Soleil" }
// reservation: { equalTo: "opentable" }
// name: { equalTo: "Aubergine" }

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "tock" }
      close: { equalTo: false }
      name: { equalTo: "Lion Dance Cafe" }
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