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

functions.http("resy_reservation_find_realtime", async (req, res) => {
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
  const total = await resy_redis(req.query.url_slug, req.query.date, req.query.party_size, req.query.timezone);
  return res.send(JSON.stringify(total));
});

// This function is used to get the available slots from Redis
// if slots are available in Redis, it will return the slots in json format
// [{ time: "2022-02-24T21:00:00-08:00" }, { time: "2022-02-24T21:15:00-08:00" }]
// If no slot are available in Redis, it will return an empty array
// If the business it not legit, it should return return null
async function resy_redis(
  url_slug, date, party_size, time_zone) {
  const key = resy_day_key(
    url_slug,
    date,
    party_size
  );
  const slots = await redis.get(key);
  if (!slots) {
    return null;
  }
  const timezone = time_zone;
  const total = [];
  slots.forEach(function (slot) {
    let datestr = dayjs.tz(slot, timezone).format();
    total.push({
      time: datestr,
    });
  });
  return total;
}

