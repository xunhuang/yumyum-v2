import { yumyumGraphQLCall } from "./yumyumGraphQLCall"

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
      }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
};



export async function BayAreaListWithTBD() {
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