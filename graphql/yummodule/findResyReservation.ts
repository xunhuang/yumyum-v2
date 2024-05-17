const superagent = require("superagent");
const moment = require("moment-timezone");

export async function findResyReservation(
  date: string,
  party_size: number,
  businessid: string,
  timezone: string
) {
  const url = "https://api.resy.com/4/find";

  return await superagent
    .get(url)
    .query({
      day: date,
      lat: 0,
      long: 0,
      party_size: party_size,
      venue_id: businessid,
    })
    .set("Accept-Encoding", "identity")
    .set("Authorization", 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
    .set(
      "User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    .then((res: any) => {
      let total: any = [];
      if (!res.body.results.venues) {
        return [];
      }
      if (!res.body.results.venues[0]) {
        return [];
      }
      let slots = res.body.results.venues[0].slots;
      slots.forEach(function (slot: any) {
        let datestr = moment.tz(slot.date.start, timezone).format();
        total.push({
          time: datestr,
        });
      });
      return total;
    });
}
