import { resy_set_venue_to_tbd, resyLists, resyAPILookupByVenueID, resy_calendar, resyAPILookupByVenueID2, venueNameSimilar, validateResyVenueInfo } from "yumutil";
import { getDistance } from "geolib";




(async function main() {
  try {
    const list = await resyLists();

    const badnames: string[] = [];

    for (let item of list) {
      console.log("checking", item.name);
      const valid = await validateResyVenueInfo(item);
      if (!valid) {
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