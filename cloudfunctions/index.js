const functions = require("@google-cloud/functions-framework");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const { findResyReservation } = require("./findResyReservation");
const { resy_day_key } = require("../tockspecial/resy_support");
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

dayjs.extend(utc);
dayjs.extend(timezone);

functions.http("resy_reservation_find", async (req, res) => {
  const result = await findResyReservation(
    req.query.date,
    req.query.party_size,
    req.query.businessid,
    req.query.timezone,
    req.query.url_slug,
  );

  return res.send(JSON.stringify(result));
});

functions.http("resy_reservation_find_redis", async (req, res) => {
  const key = resy_day_key(
    req.query.url_slug,
    req.query.date,
    req.query.party_size,
  );
  console.log("key", key);

  const slots = await redis.get(key);
  const timezone = req.query.timezone;

  const total = [];
  slots.forEach(function (slot) {
    let datestr = dayjs.tz(slot, timezone).format();
    total.push({
      time: datestr,
    });
  });

  return res.send(JSON.stringify(total));
});
