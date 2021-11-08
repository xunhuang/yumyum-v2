import superagent = require('superagent');

const express = require("express");
const { postgraphile } = require("postgraphile");

const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");

const cors = require('cors');

const app = express();

const pgConfig = {
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  database: process.env.PGDATABASE || "yumyum",
  password: process.env.PGPASSWORD || "mysecretpassword",
};

const MyRandomUserPlugin = makeExtendSchemaPlugin((build: any) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      extend type Venue {
        aaa (aaa:String!): [String!]  @requires(columns: ["key"])
      }
    `,
    resolvers: {
      Venue: {
        aaa: async (_query: any, args: any, context: any, resolveInfo: any) => {
          console.log(_query.key); // this came from the @requires above
          const result = await getdata(_query.key);
          return result;
        },
      },
    },
  };
});

async function getdata(key: string): Promise<string[]> {
  const url = 'https://us-central1-yumyumlife.cloudfunctions.net/singleVenueSearch';
  return await superagent.post(url)
    .set('Content-Type', 'application/json')
    .send({
      data: {
        venue: {
          key: key
        },
        date: '2021-11-11',
        timeOption: "dinner",
        party_size: 2,
      },
    })
    .then((res: superagent.Response) => {
      // console.log(res.text);
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
};

app.use(cors({
  origin: '*'
}));

app.use(postgraphile(pgConfig, "public", postgraphileOptions));

app.listen(8080);
