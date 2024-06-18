import {
  get_longlat_from_address,
  setVenueGPS,
  yumyumGraphQLCall,
} from "yumutil";

(async function main(): Promise<void> {
  console.log("hello");

  const tbdlist = await BayAreaListWithTBD();
  for (const venue of tbdlist) {
    console.log(`Searching for ${venue.name} - ${venue.address} ****************************************************************`);
    if (!venue.address) {
      continue;
    }
    const longlat = await get_longlat_from_address(venue.address, venue.city, venue.region);
    console.log(longlat);
    await setVenueGPS(venue.key, longlat.lng, longlat.lat);
  }

  console.log("done");
})();

async function BayAreaListWithTBD() {
  const query = `
  query MyQuery {
  allVenues(
    filter: {
      latitude: { isNull: true }
    }
  ) {
    totalCount
    nodes {
      name
      urlSlug
      businessid
      key
      longitude
      latitude
      region
      address
      city
      resyCityCode
      reservation
    }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
