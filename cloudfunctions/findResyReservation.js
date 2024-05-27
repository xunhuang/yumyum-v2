const dayjs = require("dayjs");
const { newFindReservation } = require("./resy_support");

async function findResyReservation(
  date,
  party_size,
  businessid,
  timezone,
  url_slug
) {
  const reservation = await newFindReservation(businessid, date, party_size);
  const total = [];
  if (reservation.status === 429 || reservation.status === 400) {
    console.log("resy realtime error code", reservation.status);
    if (reservation.status === 429) {
      console.log("Rate limiting Exceeded");
    }
    return null;
  }
  if (reservation.results.venues[0]) {
    const slots = reservation.results.venues[0].slots;
    slots.forEach(function (slot) {
      let datestr = dayjs.tz(slot.date.start, timezone).format();
      total.push({
        time: datestr,
      });
    });
  } else {
    return null;
  }
  return total;
}

exports.findResyReservation = findResyReservation;
