import { yumyumGraphQLCall } from "./yumyumGraphQLCall";

export async function sevenrooms_set_venue_reservation(
  venue_key: string,
  urlSlug: string,
): Promise<void> {
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    urlSlug: "${urlSlug}",
    reservation: "sevenrooms",
    withOnlineReservation: "true",
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
}
