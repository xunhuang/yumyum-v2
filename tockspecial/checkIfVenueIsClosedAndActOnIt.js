const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { RateLimiter } = require("limiter");

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "minute",
});

// return true if it is closed...

async function checkIfVenueIsClosedAndActOnIt(key, name, city, state) {
  const result = await isItClosed(name, city, state);
  console.log(
    `${name} ${city}, ${state} - ${result.closed === true ? "closed" : "open "}`
  );
  if (result.closed === true) {
    console.log(`reference: ${JSON.stringify(result)}`);
    await setVenueToClosed(key, "PERPLEXITY_AI" + JSON.stringify(result));
    return true;
  }
  return false;
}
exports.checkIfVenueIsClosedAndActOnIt = checkIfVenueIsClosedAndActOnIt;

async function setVenueToClosed(venue_key, reason) {
  const escapedReason = reason.replace(/"/g, '\\"');
  const query = `
mutation MyMutation {
  updateVenueByKey(input: {venuePatch: {
    close: true
    devnotes: "${escapedReason}"
  }, key: "${venue_key}"}) {
  venue {
    name
    key
  }
  }
}
`;

  const json = await yumyumGraphQLCall(query);
  return json;
}
async function isItClosed(name, city, state) {
  await limiter.removeTokens(1);

  const openaiApiKey = process.env.PERPLEXITY_AI_KEY;
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
  if the venued is close, add a field "reference" to link to the sources of the information.

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
  // console.log("text is", text);
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
