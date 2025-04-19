import { RateLimiter } from "limiter";
import { resy_calendar_key, resyLists, resy_calendar, saveToRedisWithChunking } from "yumutil";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 3000 });

(async function main() {
  try {
    const partySizeArg = process.argv[2];
    const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

    const rl = await resyLists();
    const answers: Record<string, any> = {};

    // randomize the list
    const l = [...rl].sort(() => Math.random() - 0.5);

    console.log("list to fetch with ", l.length, " items");
    l.map((v: any) => { console.log(v.name); });

    try {
      for (let i = 0; i < l.length && i < 1000; i++) {
        const v = l[i];
        console.log(`${i}. getting calendar for ${v.name}`);
        const calendar = await resy_calendar_ratelimited(
          v.businessid,
          party_size,
          v.name,
          30
        );
        if (calendar.status === 429) {
          console.log(v.urlSlug, party_size, "Rate limiting exceeded");
          continue;
        }
        answers[resy_calendar_key(v.urlSlug, party_size)] = calendar;
        console.log(v.name, party_size, "done");
      }
    } catch (error) {
      console.error(error);
    }
    await saveToRedisWithChunking(answers, `party of ${party_size}`);
  } catch (error) {
    console.error(error);
  }
})();

async function resy_calendar_ratelimited(venue_id: string, num_seats: number, name: string, days_ahead: number) {
  await limiter.removeTokens(1);
  return await resy_calendar(venue_id, num_seats, name, days_ahead);
}

