const getDistance = require("geolib").getDistance;
exports.getDistance = getDistance;
const { buildUrl } = require("build-url");
const { RateLimiter } = require("limiter");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const {
  opentable_set_venue_reservation,
  tock_set_venue_reservation,
} = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const { simpleFetchGet } = require("./resy_support");
const { resyAPILookupByVenueID } = require("./resy_support");

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "minute",
});

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    // for (let v of bayAreaList.slice(20, 30)) {
    for (let v of bayAreaList) {
      console.log(v.name);
      const result = await isItClosed(v.name, v.city, v.region);
      console.log(
        `${v.name} - ${v.city} - ${v.region} - ${
          result.closed === true ? "closed" : "open "
        }`
      );
      // const success = await isItClosed("SSAL", "San Francisco");
      // break;
    }
  } catch (error) {
    console.error(error);
  }
})();

async function isItClosed(name, city, state) {
  await limiter.removeTokens(1);

  require("dotenv").config();
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const systemMessage = `
  you are an agent to extract information from the web and return a simple json object.
  you are given a name of a venue and a city, and you are asked to determine if the venue is closed.
  please return a boolean value.  check google's search results, SF Eater, and yelp for the venue to determine if it's closed.
  if the venue is open, please provide if the venue is available for reservations.
  and if there is a reservation link, please provide the reservation link, and provide reservation platforms. 
  Common platforms include Tock, Resy, and OpenTable, Yelp, SevenRooms, and others.
  please return a json object and nothing else. The json object should have a boolean value for the key "closed".
  if the venue is open, the json object should have a boolean value for the key "available".
  if there is a reservation system, the json object should have a boolean variable for key "online_book" as true.
  if there is a reveration link, put string value for the key "reservationLink".
  and if there is a reservation platform, the json object should have an array of strings for the key "platform".

  please return only a pure json object with nothing else. 
  it's important to only return a json object with the correct keys and values and nothing else.
`;
  const userMessage = `
  the restaurant ${name} in ${city}, ${state} i'm trying to extract information about it. please provide me with the information 
  as instructed in the system message.
`;
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // model: "gpt-4",
      model: "llama-3-sonar-small-32k-online",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const text = await response.text();
  console.log("text is", text);

  // console.log(data.choices[0].message.content);
  var answer = "";
  try {
    const data = JSON.parse(text);
    answer = data.choices[0].message.content;
    return JSON.parse(answer);
  } catch (error) {
    return extractJsonFromText(answer);
  }
}

const extractJsonFromText = (text) => {
  const jsonRegex = /{(?:[^{}]|({)|})*}/;
  const match = text.match(jsonRegex);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  }
  return null;
};

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
      city
      region
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}
