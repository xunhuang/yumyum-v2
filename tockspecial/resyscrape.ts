import { Redis } from "@upstash/redis";
import { resy_calendar_key, resyLists, newFindReservation, resy_day_key, saveToRedisWithChunking } from "yumutil";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

    const keys = l.map((v: any) => resy_calendar_key(v.urlSlug, party_size));

    console.log(keys);
    const data = await redis.mget(keys);
    console.log(data);
    const noavail: any[] = [];
    const avail: any[] = [];

    for (let i = 0; i < l.length; i++) {
      console.log(l[i].urlSlug, l[i].name);
      const entry: any = data[i];
      // eslint-disable-next-line array-callback-return
      entry?.scheduled?.map((entry: any) => {
        if (!l[i].urlSlug) {
          console.log(l[i], "is null  xxxxxxxxxxxxxx");
          return null;
        }
        if (entry.inventory.reservation !== "available") {
          noavail.push({
            slug: l[i].urlSlug,
            venue_id: l[i].businessid,
            party_size: party_size,
            date: entry.date,
            note: entry.inventory.reservation,
          });
        } else {
          avail.push({
            slug: l[i].urlSlug,
            venue_id: l[i].businessid,
            party_size: party_size,
            date: entry.date,
          });
        }
      });
    }

    const noavailmap: Record<string, any[]> = {};
    // eslint-disable-next-line array-callback-return
    noavail.map((item) => {
      const key = resy_day_key(item.slug, item.date, item.party_size);
      noavailmap[key] = [];
    });

    await saveToRedisWithChunking(noavailmap, `no availabilites`);

    // Group the 'avail' array by the 'date' field
    const groupedAvail = avail.reduce((acc: Record<string, any[]>, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    const dates = Object.keys(groupedAvail).sort();

    for (const k of dates) {
      const answers: Record<string, any> = {};
      for (const e of groupedAvail[k]) {
        const reservation = await newFindReservation(
          e.venue_id,
          e.date,
          e.party_size
        );
        console.log(e);

        if (reservation.status === 429) {
          console.log(e.slug, e.date, e.party_size, "Rate limiting exceeded");
          continue;
        }
        const key = resy_day_key(e.slug, e.date, e.party_size);

        if (reservation.results.venues[0]) {
          answers[key] = reservation.results.venues[0].slots.map(
            (s: any) => s.date.start
          );
          if (answers[key].length === 0) {
            console.log(
              "zero length answer, inspect this",
              JSON.stringify(reservation, null, 2)
            );
          }
        } else {
          console.log(`no answer for  ${key}`);
          console.log(reservation);
          answers[key] = null;
        }
      }
      console.log(answers);
      await saveToRedisWithChunking(answers, `party of ${k}`);
    }
  } catch (error) {
    console.error(error);
  }
})();