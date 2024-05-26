const functions = require("@google-cloud/functions-framework");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const { findResyReservation } = require("./findResyReservation");

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
