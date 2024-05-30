const { Redis } = require("@upstash/redis");

// this loads from .env file in current directory (not ~/.env)
require('dotenv').config()

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const { resy_set_venue_to_tbd } = require("./resy_support");
const { resy_calendar_key } = require("./resy_support");
const { resyLists } = require("./resy_support");

(async function main() {
  try {
    const rl = await resyLists();
    const partylist = [2];
    for (let party_size of partylist) {

      const keys = rl.map(v => resy_calendar_key(v.urlSlug, party_size));
      const data = await redis.mget(keys);
      const keyDataMap = {};
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        keyDataMap[key] = data[index];
        if (data[index].last_calendar_day === null) {
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
