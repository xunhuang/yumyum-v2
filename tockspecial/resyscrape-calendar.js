const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const buildUrl = require("build-url");

const { saveToRedisWithChunking } = require("./saveToRedisWithChunking");

const dayjs = require("dayjs");

(async function main() {
  //   const partySizeArg = process.argv[2];
  //   const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

  //   if (isNaN(party_size) || party_size < 1) {
  //     console.error("Please provide a valid numeric value for party size.");
  //     process.exit(1);
  //   }
  try {
    const rl = await resyLists();
    // console.log(rl);
    // const l = rl.filter((v) => v.name == "AltoVino");
    const partylist = [2, 3, 4, 1, 5, 6, 7, 8, 9, 10];
    await Promise.all(
      partylist.map(async (party_size) => {
        const answers = {};
        const l = rl;
        console.log(l);
        for (let i = 0; i < l.length && i < 1000; i++) {
          const v = l[i];
          const calendar = await resy_calendar(
            v.businessid,
            party_size,
            v.name,
            30
          );
          answers[`resy-calendar-${v.urlSlug}-${party_size}`] = calendar;
          console.log(v.name, party_size, "done");
        }
        console.log(answers);
        await saveToRedisWithChunking(answers, `party of ${party_size}`);
      })
    );
  } catch (error) {
    console.error(error);
  }
})();

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

async function resy_calendar(venue_id, num_seats, name, days_ahead) {
  //   const today = dayjs().add(1, "days").format("YYYY-MM-DD");
  const today = dayjs().add(0, "days").format("YYYY-MM-DD");
  const enddate = dayjs().add(days_ahead, "days").format("YYYY-MM-DD");

  const url = buildUrl("https://api.resy.com", {
    path: "4/venue/calendar",
    queryParams: {
      venue_id: venue_id,
      num_seats: num_seats,
      start_date: today,
      end_date: enddate,
    },
  });
  console.log(name + " " + url);
  const a = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "cache-control": "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-origin": "https://resy.com",
    },
    referrer: "https://resy.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  const json = await a.json();
  return json;
}
