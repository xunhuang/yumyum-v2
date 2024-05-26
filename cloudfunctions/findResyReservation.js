const dayjs = require("dayjs");
const { newFindReservation } = require("../tockspecial/resy_support");

async function findResyReservation(
  date,
  party_size,
  businessid,
  timezone,
  url_slug
) {
  const slots = await newFindReservation(businessid, date, party_size);
  const total = [];
  if (slots === null || !Array.isArray(slots)) {
    console.log("slots is null not not an array", slots);
    return null;
  }
  slots.forEach(function (slot) {
    let datestr = dayjs.tz(slot.date.start, timezone).format();
    total.push({
      time: datestr,
    });
  });
  return total;
}

exports.findResyReservation = findResyReservation;
