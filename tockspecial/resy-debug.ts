import { resy_set_venue_to_tbd, resy_calendar_key, resyLists, getRedis, resy_basic_search_and_validate, getVenueByKey } from "yumutil";

// const redis = getRedis();

(async function main() {
  try {
    // const list = await resyLists();
    // const partylist = [2];

    const baditems: string[] = [];
    const badnames: string[] = [];

    // for (let item of list) {
    //   console.log(item);
    //   const result = await resy_basic_search_and_validate(item.name, item.longitude, item.latitude, item.address);
    //   if (!result
    //     || result.businessid !== item.businessid
    //     || result.urlSlug !== item.urlSlug
    //     || result.resyCityCode !== item.resyCityCode
    //   ) {
    //     baditems.push(item.key);
    //     badnames.push(item.name);
    //     console.log(item.name);
    //   }
    // }


    const badkeysinput = [
      // ok now supposed to be bad  '407fbd33-2acc-4e60-9f21-2086c066237c',
      // ok now '49780d75-349f-4fbb-8e74-a5012fdee24d',
      // ok now '794efba8-ac81-4301-bb3f-7ced485c807c',
      // wrong city!!!! and closed.  '7gKyliy2siRyQsWxoi9W',
      // should catch this name... name is similar... what happened to address. 'eec444cc-a9b0-4d70-8879-606267f49fb7',
      // 'eec444cc-a9b0-4d70-8879-606267f49fb7',
      // 'fefnJzX0erJVuNVvczFk',

      // 'ivYoqYgBYwYEIACS05ku',
      // 'KwP3tkeJMn8ozHfxCaAk',
      // 'lnwqkb161yUPLPVqnClyW',
      // 'n9sktx9ozAf4mZjCG3um',
      'oBs3rtAXxT0InXrdXyDs',
      // 'PFFw9S59Jl2MISngZbvB', // rasa, moved to opentable
      // 'PiC8VQKzKNzbEZC12qLq' the complexity in Chez panizsee is there is a cafe and a restaurant in the same address 
    ];

    for (let key of badkeysinput) {
      const item = await getVenueByKey(key);
      console.log(item);
      const result = await resy_basic_search_and_validate(item.name, item.longitude, item.latitude, item.address);
      if (!result
        || result.businessid !== item.businessid
        // || result.urlSlug !== item.urlSlug
        // || result.resyCityCode !== item.resyCityCode
      ) {
        console.log(result);
        console.log(item);
        baditems.push(item.key);
        badnames.push(item.name);
        console.log(item.name);
      }
    }


    console.log(baditems);
    console.log(badnames);

    // for (let party_size of partylist) {

    //   const keys = rl.map((v: any) => resy_calendar_key(v.urlSlug, party_size));
    //   const data = await redis.mget(keys);
    //   const keyDataMap: any = {};
    //   for (let index = 0; index < keys.length; index++) {
    //     const entry = data[index] as any;
    //     const key = keys[index];
    //     keyDataMap[key] = entry;
    //     if (entry.last_calendar_day === null) {
    //       console.log(key, "not a healthy place, likely closed or moved to another platform");
    //       const result = await resy_set_venue_to_tbd(rl[index].key);
    //       console.log(result)
    //     }
    //   }
    // }
  } catch (error) {
    console.error(error);
  }
})();
