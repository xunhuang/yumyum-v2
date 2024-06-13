import { RateLimiter } from "limiter";
import { resy_calendar_key, resyLists, resy_calendar, saveToRedisWithChunking } from "yumutil";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

(async function main() {
  try {
    const partySizeArg = process.argv[2];
    const party_size = partySizeArg ? parseInt(partySizeArg, 10) : 2;

    const rl = await resyLists();
    const answers: Record<string, any> = {};
    const l = rl;
    console.log(l);
    for (let i = 0; i < l.length && i < 1000; i++) {
      const v = l[i];
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
      console.log(answers);
    await saveToRedisWithChunking(answers, `party of ${party_size}`);
  } catch (error) {
    console.error(error);
  }
})();

async function resy_calendar_ratelimited(venue_id: string, num_seats: number, name: string, days_ahead: number) {
  await limiter.removeTokens(1);
  return await resy_calendar(venue_id, num_seats, name, days_ahead);
}

