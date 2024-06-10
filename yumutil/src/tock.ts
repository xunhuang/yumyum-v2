import { yumyumGraphQLCall } from "./yumyumGraphQLCall";

export async function tock_set_venue_reservation(
  venue_key: string,
  slug: string,
  businessid: string
): Promise<any> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${slug}",
    reservation: "tock",
    businessid: "${businessid}",
  }, key: "${venue_key}"}) {
  venue {
    name
    key
    closehours
  }
  }
}
`;
  const json = await yumyumGraphQLCall(query);
  return json;
};
