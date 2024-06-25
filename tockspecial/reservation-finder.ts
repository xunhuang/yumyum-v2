import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock,
  checkIfVenueIsClosedAndActOnIt,
  tock_support_shutdown,
  validateResyVenueInfo,
  validateTockVenueInfo,
  validateOpentableVenueInfo,
  GoogleIsThisPlaceClosed,
  setVenueToClosed,
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
  const found = await process_for_opentable(true, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
  if (found) {
    return true;
  }
  if (venue.reservation === "opentable") {
    return await validateOpentableVenueInfo(venue);
  }
  return false;
}
async function is_this_resy(venue: any): Promise<boolean> {
  // first try to find the venue by the name/address/slug via the search system
  const found = await process_for_resy(true, venue.key, venue.name, venue.longitude, venue.latitude, venue.address);
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
  const closed = await GoogleIsThisPlaceClosed(venue.name, venue.address, venue.city, venue.region);
  if (closed === undefined) {
    //this means unknown
    return await checkIfVenueIsClosedAndActOnIt(true, venue.key, venue.name, venue.city, venue.region);
  }
  if (closed) {
    await setVenueToClosed(venue.key, "google places API");
  }
  return closed;
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
    console.log(`Searching for ${venue.name} - ${venue.address} ****************************************************************`);
    const reservation = venue.reservation;
    const func = functionMap[reservation];
    if (func) {
      const found = await func(venue);
      if (found) {
        console.log(`Found ${reservation} for ${venue.name} MATCHING ++++++++++++++++++++++++++++++++++`);
        continue;
      }
    }
    const which = await whichReservationSystemIsthis(venue);
    if (which) {
      console.log(` need to update ----------------- ${venue.name} -  should be to ${which}  YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`);
    }
  }

  console.log("done");
  await tock_support_shutdown();
})();
// name: { equalTo: "Noosh" } // closed 
//  name: { equalTo: "Auberge du Soleil" }
// reservation: { equalTo: "opentable" }
// name: { equalTo: "Aubergine" }
// name: { equalTo: "Bombera" }

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { in: ["opentable", "resy", "tock", "TBD"] }
      close: { equalTo: false }

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
      businessid
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}