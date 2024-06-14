import { resy_set_venue_to_tbd, resy_calendar_key, resyLists, getRedis, yumyumGraphQLCall } from "yumutil";
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import fs from 'fs';

const michelinData = JSON.parse(fs.readFileSync('../public/data/bayarea.json', 'utf8'));


// this file performs the following:
// 1. import new michelin data to the database
// 2. update the database with outdated michelin data
// 3. Repopulate the database with michelin data (images, star ratings, address etc)

export async function bayAreaDatabaseList(): Promise<any> {
  const query = `
    query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}}
  ) {
     nodes {
        name
        urlSlug
        businessid
        michelinobjectid
        key
              stars
      reservation
      city
      close
      }
  }
}
`;
  const jsonData = await yumyumGraphQLCall(query);
  return jsonData.data.allVenues.nodes;
}

export function JsonEntrySameWasDbEntry(
  jsonentry: any,
  dbentry: any
): boolean {
  if (jsonentry.objectID === dbentry.michelinobjectid) {
    // console.log("Found by objectid", jsonentry.name, dbentry.michelinobjectid);
    return true;
  }
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
  return false;
}

(async function main() {
  // await importNewMichelinDataToDatabase();
  const dbList = await bayAreaDatabaseList();
  const outdated = await outdatedList(michelinData, dbList);
})();


async function importNewMichelinDataToDatabase() {
  try {
    const dbList = await bayAreaDatabaseList();
    const newOnly = michelinDataNewToDbList(michelinData, dbList);
    // console.log(newOnly);
    const metro = "bayarea";
    const timezone = "America/Los_Angeles";

    for (var item of newOnly) {
      const v = {
        key: nanoid(),
        vintage: dayjs().year().toString(),
        close: false,
        name: item.name,
        metro: metro,
        michelinslug: item.slug,
        michelinobjectid: item.objectID,
        address: item._highlightResult.street.value,
        city: item.city.name,
        country: item.country.name,
        coverImage: item.main_image?.url || "",
        cuisine: item.cuisines.map((c: any) => c.label).join(", "),
        imageList: JSON.stringify(
          item.images?.map((i: any) => i.url) || []
        ),
        latitude: item._geoloc.lat,
        longitude: item._geoloc.lng,
        michelineOnlineReservation: item.online_booking === 1,
        region: item.region.name,
        reservation: "TBD",
        stars: item.michelin_award || "MICHELIN_PLATE",
        timezone: timezone,
        url: item.slug,
        zip: item.slug,
      };
      console.log(v);
      const result = await createVenue(v);
      console.log(result);
    }
  } catch (error) {
    console.error(error);
  }
}

function stringifyWithoutQuotes(obj: any): string {
  if (typeof obj !== "object" || obj === null) {
    // Return the JSON stringified version of non-object types (or null)
    return JSON.stringify(obj);
  }
  let props = Object.keys(obj)
    .map(key => `${key}:${stringifyWithoutQuotes(obj[key])}`)
    .join(",");
  return `{${props}}`;
}

async function createVenue(venue: any) {
  const query = `
  mutation MyMutation {
    createVenue(input: {
      venue:${stringifyWithoutQuotes(venue)}
    }) {
      venue {
        name
        key
      }
    }
  }
  `;
  console.log(query);
  const jsonData = await yumyumGraphQLCall(query);
  return jsonData.data.createVenue.venue;
}

// these should be added as TBDs...
function michelinDataNewToDbList(michelinData: any, dbList: any): [any] {
  const matches: any = [];
  const newOnly = michelinData.filter((jsonentry: any) => {
    const found = dbList.find(
      (dbentry: any, index: number, thisobject: any) => {
        return JsonEntrySameWasDbEntry(jsonentry, dbentry);
      }
    );
    if (found) {
      matches.push({ newItem: jsonentry.name, found: found.name });
    }
    return !found;
  });
  return newOnly;
}

// these are the "former" restaurants that are no longer in the michelin list
// we should set "stars" to "MICHELIN_FORMER" 
async function outdatedList(michelinData: any, dbList: any): Promise<any> {
  const outdated = dbList.filter((dbentry: any) => {
    const found = michelinData.find(
      (jsonentry: any, index: number, thisobject: any) => {
        return JsonEntrySameWasDbEntry(jsonentry, dbentry);
      }
    );
    return !found;
  });
  // console.log(newOnly);
  // console.log(matches);

  for (var item of outdated) {
    console.log(item.name, item.stars);
    if (["BIB_GOURMAND", "MICHELIN_PLATE", "1", "2", "ONE_STAR", "TWO_STAR"].includes(item.stars)) {
      console.log("Found outdated", item.name, item.key);
      await set_michelin_former(item.key);
    } else {
      console.log("Found outdated", item.name, "********************************");
    }
  }
  return outdated;

}
async function set_michelin_former(
  venue_key: string,
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    stars: "MICHELIN_FORMER",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;
  const jsonData = await yumyumGraphQLCall(query);
  return jsonData.data.updateVenueByKey.venue;
}