const { Redis } = require("@upstash/redis");
const { saveToRedisWithChunking } = require("./saveToRedisWithChunking");
const { resy_calendar_key } = require("./resy_support");
const { resyLists } = require("./resy_support");
const { RateLimiter } = require("limiter");
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const dayjs = require("dayjs");
const { newFindReservation } = require("./resy_support");

(async function main() {
  const partySizeArg = process.argv[2];
  const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

  if (isNaN(party_size) || party_size < 1) {
    console.error("Please provide a valid numeric value for party size.");
    process.exit(1);
  }
  try {
    const rl = await resyLists();
    console.log(rl);
    // const l = rl.filter((v) => v.name == "AltoVino");
    // const l = rl.filter((v) => v.name == "Lord Stanley");
    const l = rl;
    // const l = rl.slice(0, 30);

    const keys = l.map((v) => resy_calendar_key(v.urlSlug, party_size));

    console.log(keys);
    const data = await redis.mget(keys);
    console.log(data);
    const noavail = [];
    const avail = [];

    for (i = 0; i < l.length; i++) {
      console.log(l[i].urlSlug, l[i].name);
      console.log(data[i]);
      data[i]?.scheduled?.map((entry) => {
        if (!l[i].urlSlug) {
          console.log(l[i], "is null            xxxxxxxxxxxxxx");
          return;
        }
        if (entry.inventory.reservation != "available") {
          noavail.push({
            slug: l[i].urlSlug,
            venue_id: l[i].bussinessid,
            party_size: party_size,
            date: entry.date,
            note: entry.inventory.reservation,
          });
        } else {
          avail.push({
            slug: l[i].urlSlug,
            party_size: party_size,
            date: entry.date,
          });
        }
      });
    }

    await saveToRedisWithChunking(noavail, `no availabilites`);

    // Group the 'avail' array by the 'date' field
    const groupedAvail = avail.reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    for (k in groupedAvail) {
      const answers = {};
      for (e of groupedAvail[k]) {
        const reservation = await newFindReservation(
          e.venue_id,
          e.date,
          e.party_size
        );
        const key = `resy-${e.slug}-${e.date}-${e.party_size}`;
        if (reservation.results.venues[0]) {
          answers[key] = reservation.results.venues[0].slots.map(
            (s) => s.date.start
          );
        } else {
          console.log(`no answer for  ${key}`);
          console.log(reservation);
          answers[key] = null;
        }
      }
      console.log(answers);
      await saveToRedisWithChunking(answers, `party of ${e.date}`);
    }
  } catch (error) {
    console.error(error);
  }
})();
