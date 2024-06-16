import { resy_set_venue_to_tbd, resyLists, resyAPILookupByVenueID, resy_calendar, resyAPILookupByVenueID2 } from "yumutil";
import { getDistance } from "geolib";

var similarity = require('jaro-winkler');



function venueNameSimilar(name1: string, name2: string): boolean {
  const distance = similarity(name1, name2);
  if (distance > 0.9) {
    return true;
  }
  // not exact or close... but still
  const normalized1 = name1.toLowerCase().replace(/[^a-z0-9]/gi, ' ');
  const normalized2 = name2.toLowerCase().replace(/[^a-z0-9]/gi, '');
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }

  return false;
}

// This file is to validate existing Resy venue to make sure they are still current.  
// Many reason why a venue would not be current
//   - going out of business
//   - switched platforms
//   - manual/earlier mistakes
// 
// Other changes can occur over time: resy urlslug may change, resy city code may change
// 
// Method for determination
//  1. search: if I perform a search and can identify the same place. 
//         however a search may failed for many reasons (name mismatched (Angler vs Angler'SF), wrong 
//         long/lat, wrong street name, or failed usps API etc.
//  2. if a venue ID's calendar call fails --> bad
//  3. if a venue ID's find reservation call fails --> bad
//  4. Lookup by venue ID, same location --> good
//              this returns long/lat, but not address
//              this return name, and veneu_group name 
// 
// main logic
//      if (lookupbyID is bad) ==> definitely bad 
//      if (lookupbyID is good)
//         if (calendar_call is bad) ==> bad
//                   (need to sure the call succeceed with a legit json)
//         if (reservation finder is bad) ==> bad
//                   (need to sure the call succeceed with a legit json)
// do we need search then???

async function getKeyInfoByResyVenueID(businessid: string): Promise<any> {
  const result = await resyAPILookupByVenueID(businessid);
  // console.log(result);
  if (!result || result.results.venues.length === 0) {
    return null;
  }

  const venue = result.results.venues[0];
  const response = {
    longitude: venue.venue.location.geo.lon,
    latitude: venue.venue.location.geo.lat,
    name: venue.venue.name,
    groupname: venue.venue.venue_group.name,
    url_slug: venue.venue.url_slug,
    resyCityCode: venue.venue.location.code,
    city: venue.venue.location.name,
  }
  return response;
}
async function getKeyInfoByResyVenueID2(urlslug: string, location_id: string): Promise<any> {
  const result = await resyAPILookupByVenueID2(urlslug, location_id);
  // console.log(JSON.stringify(result, null, 2));
  if (!result) {
    return null;
  }

  const venue = result;
  const response = {
    longitude: venue.location.longitude,
    latitude: venue.location.latitude,
    name: venue.name,
    groupname: venue.venue_group.name,
    url_slug: venue.url_slug,
    resyCityCode: venue.location.code,
    city: venue.location.locality,
    businessid: venue.id.resy.toString(),
  }
  return response;
}

async function checkIsValidlityByResyVenueIdLookup(item: any): Promise<boolean> {
  let result = await getKeyInfoByResyVenueID(item.businessid);
  // const result = await getKeyInfoByResyVenueID2(item.businessid, item.resyCityCode);
  // let result = await getKeyInfoByResyVenueID2(item.urlSlug, "san-francisco-ca");

  if (result && item.urlSlug === result.url_slug) {
    // same slug ---- good, who would use other's companie's slug?
    console.log("same slug ******************************", item.name);
    return true;
  }

  if (result) {
    // slug is not matching..... 
    console.log("slug is not matching ******************************", item.urlSlug, result.url_slug);
    // needs to update the slugs and city code.. 
    // XXX TODO...
    // but continue.... 
  } else {
    result = await getKeyInfoByResyVenueID2(item.urlSlug, "san-francisco-ca");
    if (!result) {
      console.log("no result after 2 searches ****************** for", item);
      return false;
    }
    if (item.businessid !== result.businessid) {
      console.log("business id is not the same ******************", item.businessid, result.businessid);
      // check if ID are the same....
      // XXX TODO...
      return false;
    }
    // continue..... 
  }

  const physicaldistance = getDistance(
    { latitude: item.latitude, longitude: item.longitude },
    { latitude: result.latitude, longitude: result.longitude }
  );

  if (physicaldistance > 100000) {
    // 10Km istoo far away
    console.log("way too far ", item.name, physicaldistance);
    return false;
  }

  if (venueNameSimilar(item.name, result.name)) {
    console.log("name similar ", item.name, result.name);
    return true;
  }
  if (venueNameSimilar(item.name, result.groupname)) {
    console.log("group name similar ", item.name, result.groupname);
    return true;
  }

  return false;
}

(async function main() {
  try {
    const list = await resyLists();

    const badnames: string[] = [];

    for (let item of list) {
      console.log("checking", item.name);
      const valid = await checkIsValidlityByResyVenueIdLookup(item);
      if (!valid) {
        badnames.push(item.name);
        console.log("BADBADBAD ******************", item.name);
        continue;
      }
      const calendar = await resy_calendar(item.businessid, 2, item.name, 30);
      if (calendar && calendar.last_calendar_day !== null) {
        console.log("good ******************", item.name);
      } else {
        console.log("bad ******************", item.name);
        badnames.push(item.name);
      }

    }
    console.log("In Summary this is a bad list");
    // XXX TODO... set these to TBD. Not automatated yet because there is very limited data
    // to make me confident it works well.
    // for (let name of badnames) {
    //   await resy_set_venue_to_tbd(key_not_name);
    // }
    console.log(badnames);
  } catch (error) {
    console.error(error);
  }
})();