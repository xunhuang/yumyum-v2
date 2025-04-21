import { yumyumGraphQLCall } from "yumutil";
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import fs from 'fs';
import { JsonEntrySameWasDbEntry } from "yumutil";

const michelinData = JSON.parse(fs.readFileSync('../public/data/bayarea.json', 'utf8'));
// XXX hardcode for now
const metro = "bayarea";
const timezone = "America/Los_Angeles";


// this file performs the following:
// 1. import new michelin data to the database
// 2. update the database with outdated michelin data
// 3. Repopulate the database with michelin data (images, star ratings, address etc)

export async function bayAreaDatabaseList(): Promise<any> {
  const query = `
  query MyQuery {
  allVenues(filter: {metro: {equalTo: "bayarea"}, close: {equalTo: false}}) {
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


async function repopulateMichelinData() {
  try {
    const dbList = await bayAreaDatabaseList();
    for (const jsonentry of michelinData) {
      const venue = dbList.find(
        (dbentry: any, index: number, thisobject: any) => {
          return JsonEntrySameWasDbEntry(jsonentry, dbentry);
        }
      );

      if (!venue) {
        console.log("Entry in Michelin data not found in yumyum database", jsonentry.name);
        continue;
      }

      let coverImage = jsonentry.main_image?.url;
      if (!coverImage) {
        coverImage = venue.coverImage;
      }
      if (!coverImage) {
        console.log("No cover image", venue.name);
        continue;
      }

      let imageList = JSON.stringify(
        jsonentry.images?.map((i: any) => i.url) || []
      );

      const v = {
        name: jsonentry.name,
        metro: metro,
        michelinslug: jsonentry.slug,
        michelinobjectid: jsonentry.objectID,
        coverImage: coverImage,
        cuisine: jsonentry.cuisines.map((c: any) => c.label).join(", "),
        imageList: imageList,
        latitude: jsonentry._geoloc.lat,
        longitude: jsonentry._geoloc.lng,
        stars: normalize_star_rating(jsonentry.michelin_award || "MICHELIN_PLATE"),
        url: `https://guide.michelin.com${jsonentry.url}`,
        michelineOnlineReservation: jsonentry.online_booking === 1,
      };
      console.log("Updating venue", venue.name);
      await set_venue_data_change(venue.key, v);
    }
  } catch (error) {
    console.error(error);
  }
}

function normalize_star_rating(stars: string): string {
  if (stars === "selected") {
    return "MICHELIN_PLATE";
  }
  return stars;
}

async function importNewMichelinDataToDatabase() {
  try {
    const dbList = await bayAreaDatabaseList();
    const newOnly = michelinDataNewToDbList(michelinData, dbList);
    console.log(`New restaurants to import: ${newOnly.length}`);

    for (var item of newOnly) {
      // console.log(JSON.stringify(item, null, 2));
      const v = {
        key: nanoid(),
        vintage: dayjs().year().toString(),
        close: false,
        name: item.name,
        metro: metro,
        michelinslug: item.slug,
        michelinobjectid: item.objectID,
        address: item._highlightResult.street?.value || "",
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
      console.log("Creating venue", item.name);
      await createVenue(v);
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
async function findOutdatedEntries(): Promise<any> {
  const dbList = await bayAreaDatabaseList();
  const outdated = dbList.filter((dbentry: any) => {
    const found = michelinData.find(
      (jsonentry: any, index: number, thisobject: any) => {
        return JsonEntrySameWasDbEntry(jsonentry, dbentry);
      }
    );
    return !found;
  });

  for (var item of outdated) {
    if (["BIB_GOURMAND", "MICHELIN_PLATE", "1", "2", "ONE_STAR", "TWO_STAR", "selected"].includes(item.stars)) {
      console.log("Found outdated venue. Setting to MICHELIN_FORMER", item.name, item.key);
      // await set_michelin_former(item.key);
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

async function set_venue_data_change(
  venue_key: string,
  venue_data: any
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: ${stringifyWithoutQuotes(venue_data)}, key: "${venue_key}"}) {
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

(async function main() {
  await importNewMichelinDataToDatabase();
  await findOutdatedEntries();
  await repopulateMichelinData();
})();