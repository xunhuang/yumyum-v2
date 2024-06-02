const getDistance = require("geolib").getDistance;
exports.getDistance = getDistance;
const { buildUrl } = require("build-url");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const {
  opentable_set_venue_reservation,
  tock_set_venue_reservation,
} = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const { simpleFetchGet } = require("./resy_support");
const { resyAPILookupByVenueID } = require("./resy_support");
const { resultKeyNameFromField } = require("@apollo/client/utilities");
const { process_for_opentable } = require("./opentable_support");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log(v.name);
      const success = await isItClosed(
        v.name,
        "San Francisco"
      );
      break;
    }
  } catch (error) {
    console.error(error);
  }
})();


async function isItClosed(name, city) {
  // Remove URLs from the content
  const openaiApiKey = "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";

  const systemMessage = `
  you are an agent to extract information from the web.
  you are given a name of a venue and a city, and you are asked to determine if the venue is closed.
  please return a boolean value. if the venue is open, please provide if the venue is available for reservations.
  and if there is a reservation link, please provide the reservation link, and provide reservation platforms. 
  Common platforms include Tock, Resy, and OpenTable, Yelp, SevenRooms, and others.
  please return a json object and nothing else. The json object should have a boolean value for the key "closed".
  if the venue is open, the json object should have a boolean value for the key "available".
  if there is a reservation system, the json object should have a boolean variable for key "online_book" as true.
  if there is a reveration link, put string value for the key "reservationLink".
  and if there is a reservation platform, the json object should have an array of strings for the key "platform".
`;
  const userMessage = `
  the restaurant ${name} in ${city} i'm trying to extract information about it. please provide me with the information 
  as instructed in the system message.
`;
  const response = await fetch(
    // "https://api.openai.com/v1/chat/completions",
    "https://api.perplexity.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // model: "gpt-4",
        model: "llama-3-sonar-small-32k-online",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          { role: "user", content: systemMessage + userMessage },
        ],
      }),
    }
  );

  console.log(response);

  const text = await response.text();
  console.log("-------------------------------------");
  console.log(text);
  const data = JSON.parse(text);
  console.log(data);
  return data;
}


async function BayAreaListWithTBD() {
  // michelinobjectid: { isNull: false }
  // url: { startsWith: "https://guide.michelin.com" }
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
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
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}


