const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");

function resy_calendar_key(slug, party_size) {
  return `resy-calendar-${slug}-${party_size}`;
}
exports.resy_calendar_key = resy_calendar_key;
async function resyLists() {
  const query = `
  query MyQuery {
  allVenues(
    filter: {metro: {equalTo: "bayarea"}, reservation: {equalTo: "resy"}, close:{equalTo:false}}
  ) {
nodes {
        name
        urlSlug
        businessid
      }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
exports.resyLists = resyLists;
