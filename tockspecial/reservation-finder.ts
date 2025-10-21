import {
  yumyumGraphQLCall,
  process_for_opentable,
  process_for_resy,
  process_for_tock,
  checkIfVenueIsClosedAndActOnIt,
  validateResyVenueInfo,
  validateTockVenueInfo,
  validateOpentableVenueInfo,
  GoogleIsThisPlaceClosed,
  setVenueToClosed,
  resy_set_venue_to_tbd,
  browserPageShutdown,
  process_for_yelp,
  validateYelpVenueInfo,
} from "yumutil";

async function is_this_tock(venue: any): Promise<boolean> {
  const found = await process_for_tock(
    true,
    venue.key,
    venue.name,
    venue.longitude,
    venue.latitude,
    venue.address,
    venue.city,
    venue.region
  );
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
  const found = await process_for_opentable(
    true,
    venue.key,
    venue.name,
    venue.longitude,
    venue.latitude,
    venue.address
  );
  console.log("found", found);
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
  const found = await process_for_resy(
    true,
    venue.key,
    venue.name,
    venue.longitude,
    venue.latitude,
    venue.address
  );
  if (found) {
    return true;
  }
  // if the venue is already resy(per input), then we need to validate the venue info
  // by directly fetching the info via business id/slug and see if it matches
  if (venue.reservation === "resy") {
    return await validateResyVenueInfo(venue);
  }
  return false;
}
async function is_this_yelp(venue: any): Promise<boolean> {
  const found = await process_for_yelp(
    true,
    venue.key,
    venue.name,
    venue.longitude,
    venue.latitude,
    venue.address,
    venue.city,
    venue.region
  );
  if (found) {
    return true;
  }
  // not found via search, let's use existing info to see
  // if it's still tock, functional and same name given the same tock slug
  if (venue.reservation === "yelp") {
    return await validateYelpVenueInfo(venue);
  }
  return false;
}
async function is_this_closed(venue: any): Promise<boolean> {
  const isGoogleClosed = await GoogleIsThisPlaceClosed(
    venue.name,
    venue.address,
    venue.city,
    venue.region
  );
  const isPerplexityClosed = await checkIfVenueIsClosedAndActOnIt(
    false,
    venue.key,
    venue.name,
    venue.city,
    venue.region
  );
  if (isGoogleClosed || isPerplexityClosed) {
    await setVenueToClosed(
      venue.key,
      isGoogleClosed ? "google places API" : "perplexity"
    );
    console.log(`${venue.name} is closed`);
    return true;
  }
  console.log(`${venue.name} is open`);
  return false;
}

async function whichReservationSystemIsthis(
  venue: any
): Promise<string | null> {
  for (const key in functionMap) {
    const func = functionMap[key];

    console.log(`Checking reservation system ${key} for ${venue.name}`);
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
  yelp: is_this_yelp,
};

(async function main(): Promise<void> {
  // Basic arg parsing for --all and --only (supports --only type or --only=type)
  const args = process.argv.slice(2);
  let onlyType: string | null = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--only" && i + 1 < args.length && !args[i + 1].startsWith("-")) {
      onlyType = args[i + 1];
      i++;
      continue;
    }
    if (a.startsWith("--only=")) {
      onlyType = a.split("=", 2)[1] || null;
      continue;
    }
  }

  if (onlyType && !Object.keys(functionMap).includes(onlyType) && onlyType !== "TBD") {
    console.error(
      `Invalid --only value: ${onlyType}. Valid options: ${Object.keys(functionMap).join(", ")}`
    );
    process.exit(1);
  }

  // Build initial worklist, then optionally filter by reservation type
  const allList = await BayAreaListAll();
  const worklist = onlyType
    ? allList.filter((v: any) => v.reservation === onlyType)
    : allList;

  console.log(`Found ${worklist.length} venues to check`);
  for (const venue of worklist) {
    console.log(
      `Searching for ${venue.name} - ${venue.address} ****************************************************************`
    );
    // Default behavior: try venue's current reservation type first, then search all
    const reservation = venue.reservation;
    const func = functionMap[reservation];
    if (func) {
      const found = await func(venue);
      if (found) {
        console.log(
          `Found ${reservation} for ${venue.name} MATCHING ++++++++++++++++++++++++++++++++++`
        );
        continue;
      }
    }
    const which = await whichReservationSystemIsthis(venue);
    if (which) {
      console.log(
        `updated  ----------------- ${venue.name} to ${which}  YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`
      );
      continue;
    }

    if (await is_this_closed(venue)) {
      continue;
    }

    console.log(
      `out of ideas  ----------------- ${venue.name} to TBD  HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH`
    );
    await resy_set_venue_to_tbd(venue.key);
  }

  console.log("done");
  await browserPageShutdown();
})();

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      reservation: { in: [ "TBD"] }
      metro: { equalTo: "bayarea" }
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
      businessid
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}

async function BayAreaListAll() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
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
      businessid
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
