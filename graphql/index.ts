import superagent = require('superagent');

const express = require("express");
const { postgraphile } = require("postgraphile");

const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const DataLoader = require('dataloader');
const cors = require('cors');
const NodeCache = require("node-cache");
const myCache = new NodeCache(
  { stdTTL: 60 * 15, checkperiod: 120 }
  // { stdTTL: 45, checkperiod: 120 } // 45 seconds for testing the cache
);

myCache.clear = () => {
  myCache.flushAll();
};
myCache.delete = (key: string) => {
  myCache.del(key);
}

const app = express();

const pgConfig = {
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  database: process.env.PGDATABASE || "yumyum",
  password: process.env.PGPASSWORD || "mysecretpassword",
};

const batchGetUserById = async (ids: string[]) => {
  console.log('called once per tick:', ids);
  const handles = ids.map(async id => {
    // console.log("Cache miss hit for " + id);
    // this is not a m-get so this use of batching is kind of pointless
    // except for using the cache
    const args = JSON.parse(id);
    const result = await getdata(args.venue.key, args.date, args.party_size, args.timeOption);
    return result;
  });

  return await Promise.all(handles);
};

const userLoader = new DataLoader(batchGetUserById, {
  cacheMap: myCache,
});

const MyRandomUserPlugin = makeExtendSchemaPlugin((build: any) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Venue {
        slots (date:String!, party_size:Int=2, timeOption:String = "dinner" ): [String!]  @requires(columns: ["key"])
      }
    `,
    resolvers: {
      Venue: {
        slots: async (_query: any, args: any, context: any, resolveInfo: any) => {
          // console.log(_query.key); // this came from the @requires above
          // console.log(args);
          args.venue = { key: _query.key };
          const result = await userLoader.load(JSON.stringify(args));
          return result;
        },
      },
    },
  };
});

async function getdata(key: string, date: string, party_size: number, timeOption: string): Promise<string[]> {
  const url = 'https://us-central1-yumyumlife.cloudfunctions.net/singleVenueSearch';
  return await superagent.post(url)
    .set('Content-Type', 'application/json')
    .send({
      data: {
        venue: {
          key: key
        },
        date: date, // '2021-11-12',
        timeOption: timeOption,//"dinner",
        party_size: party_size, // 2
      },
    })
    .then((res: superagent.Response) => {
      const result = JSON.parse(res.text);
      return result.result.slots?.map((a: any) => a.time);
    }, (err: any) => {
      console.log(err);
      return null;
    });
}

const postgraphileOptions = {
  enhanceGraphiql: true,
  graphiql: true,
  appendPlugins: [ConnectionFilterPlugin, MyRandomUserPlugin],
  exportGqlSchemaPath: "../schema.graphql",

};

app.use(cors({
  origin: '*'
}));

app.use(postgraphile(pgConfig, "public", postgraphileOptions));

app.listen(8080);
