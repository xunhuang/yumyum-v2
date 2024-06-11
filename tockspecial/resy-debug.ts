import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';
import { resy_set_venue_to_tbd, resy_calendar_key, resyLists } from "yumutil";

// this loads from .env file in current directory (not ~/.env)
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


(async function main() {
  try {
    const rl = await resyLists();
    const partylist = [2];
    for (let party_size of partylist) {

      const keys = rl.map((v: any) => resy_calendar_key(v.urlSlug, party_size));
      const data = await redis.mget(keys);
      const keyDataMap: any = {};
      for (let index = 0; index < keys.length; index++) {
        const entry = data[index] as any;
        const key = keys[index];
        keyDataMap[key] = entry;
        if (entry.last_calendar_day === null) {
          console.log(key, "not a healthy place, likely closed or moved to another platform");
          const result = await resy_set_venue_to_tbd(rl[index].key);
          console.log(result)
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
