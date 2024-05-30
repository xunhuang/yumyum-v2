import { Venue } from '../generated/graphql';

export function JsonEntrySameWasDbEntry(
  jsonentry: any,
  dbentry: Venue | any
): boolean {
  if (jsonentry.slug === dbentry.michelinslug) {
    // console.log("Found by slug", jsonentry.name);
    return true;
  }
  if (dbentry.name === jsonentry.name) {
    // console.log("Found by name", jsonentry.name);
    return true;
  }
  // there are many restaurants with the same address, especially over the years
  // when some places close and new ones open
  // if (jsonentry._highlightResult.street.value === dbentry.address) {
  //   // console.log("Found by address", jsonentry.name, dbentry.address);
  //   return true;
  // }
  if (jsonentry.objectID === dbentry.michelinobjectid) {
    // console.log("Found by objectid", jsonentry.name, dbentry.michelinobjectid);
    return true;
  }
  return false;
}