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