import {
  yumyumGraphQLCall,
  GoogleFindStreetAddressFromText,
  setVenueAddress,
} from "yumutil";

(async function main(): Promise<void> {

  const missinglist = await BayAreaListWithMissingAddress();
  for (const venue of missinglist) {
    console.log(`Searching for ${venue.name} - ${venue.city} - ${venue.region}`);
    const address = await GoogleFindStreetAddressFromText(
      venue.name + " " + venue.city + " " + venue.region + " michelin guide");
    if (!address) {
      console.log(`No address found for ${venue.name} - ${venue.city} - ${venue.region}`);
      continue;
    }
    console.log(`Found address ${address} for ${venue.name} - ${venue.city} - ${venue.region}`);
    await setVenueAddress(venue.key, address);
  }

  console.log("done");
})();

async function BayAreaListWithMissingAddress() {
  const query = `
 query MyQuery {
  allVenues(
    filter: {
      close: { equalTo: false }
      address: { equalTo: "" }
      metro: { equalTo: "bayarea" }
    }
  ) {
    nodes {
      name
      address
      city
      region
      key
    }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
