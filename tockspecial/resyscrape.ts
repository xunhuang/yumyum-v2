import {
  resy_calendar_key,
  resyLists,
  resy_day_key,
  saveToRedisWithChunking,
  getRedis,
  resyFindReservation,
  ensureReliableProxies,
} from "yumutil";

const redis = getRedis();

(async function main() {
  const partySizeArg = process.argv[2];
  const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

  if (isNaN(party_size) || party_size < 1) {
    console.error("Please provide a valid numeric value for party size.");
    process.exit(1);
  }
  try {
    await ensureReliableProxies(true);
    const resy_full_list = await resyLists();
    // const l = rl.filter((v) => v.name == "AltoVino");
    // const workingList = resy_full_list.slice(0, 5);
    const workingList = [...resy_full_list].sort(() => Math.random() - 0.5);

    const keys = workingList.map((v: any) =>
      resy_calendar_key(v.urlSlug, party_size)
    );

    // keys in the form of
    // [
    //   "resy-calendar-rich-table-2",
    //   "resy-calendar-the-morris-2",
    //   "resy-calendar-outerlands-2",
    //   "resy-calendar-mama-2",
    //   "resy-calendar-iyasare-2",
    // ];

    const data = await redis.mget(keys);
    // data is an array of objects in the form of
    //
    // [
    //  {
    //   "scheduled": [
    //             {
    //     "date": "2025-05-10",
    //     "inventory": {
    //       "reservation": "available",
    //       "event": "not available",
    //       "walk-in": "available"
    //     }
    //   }
    //  ...
    //   ],
    //  }
    // ]

    // console.log(JSON.stringify(data, null, 2));
    const noavail: any[] = [];
    const avail: any[] = [];

    for (let i = 0; i < workingList.length; i++) {
      // console.log(l[i].urlSlug, l[i].name);
      const entry: any = data[i];
      // eslint-disable-next-line array-callback-return
      entry?.scheduled?.map((entry: any) => {
        if (!workingList[i].urlSlug) {
          console.log(workingList[i], "is null  xxxxxxxxxxxxxx");
          return null;
        }
        if (entry.inventory.reservation !== "available") {
          noavail.push({
            slug: workingList[i].urlSlug,
            venue_id: workingList[i].businessid,
            party_size: party_size,
            date: entry.date,
            note: entry.inventory.reservation,
          });
        } else {
          avail.push({
            slug: workingList[i].urlSlug,
            venue_id: workingList[i].businessid,
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

    console.log("These dates have no availability, saving first into Redis");
    console.log(JSON.stringify(noavailmap, null, 2));

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

    // Include today and filter out dates in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison

    const dates = Object.keys(groupedAvail)
      .filter((date) => {
        // Create date with YYYY-MM-DD format to avoid timezone issues
        const [year, month, day] = date.split("-").map(Number);
        const dateToProcess = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        return dateToProcess >= currentDate; // This already includes today since we're using >= comparison
      })
      .sort();

    let totalEntries = 0;
    for (const k of dates) {
      totalEntries += groupedAvail[k].length;
    }
    console.log(`Total number of entries to process: ${totalEntries}`);

    for (const k of dates) {
      console.log(`Processing reservations for date: ${k}`);
      const answers: Record<string, any> = {};
      try {
        const randomized_avail = [...groupedAvail[k]].sort(
          () => Math.random() - 0.5
        );
        for (const e of randomized_avail) {
          console.log(
            `finding reservation for ${e.slug} ${e.date} ${e.party_size}`
          );
          const reservation = await resyFindReservation(
            e.venue_id,
            e.date,
            e.party_size
          );

          if (!reservation) {
            console.log(e.slug, e.date, e.party_size, "transport error");
            continue;
          }

          if (reservation.status === 429) {
            console.log(e.slug, e.date, e.party_size, "Rate limiting exceeded");
            continue;
          }
          const key = resy_day_key(e.slug, e.date, e.party_size);

          if (reservation.results.venues[0]) {
            const slots = reservation.results.venues[0].slots.map(
              (s: any) => s.date.start
            );
            console.log(
              `${slots.length} slots for ${e.slug} ${e.date} ${e.party_size}`
            );
            answers[key] = slots;
          } else {
            console.log(
              `No answer for  ${key} setting to empty array for slots`
            );
            console.log(reservation);
            answers[key] = [];
          }
        }
      } catch (error) {
        console.error(error);
        console.log(
          `catching error here but continue save the results so far for ${k}`
        );
      }

      console.log(`Saving answers for ${k}`);
      await saveToRedisWithChunking(answers, `party of ${k}`);
    }
  } catch (error) {
    console.error(error);
  }
})();
