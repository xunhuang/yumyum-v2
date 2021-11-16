import { YumYumVenueAvailabilityPlugin } from './YumYumVenueAvailabilityPlugin';

const express = require("express");
const { postgraphile } = require("postgraphile");

const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const cors = require('cors');

const app = express();

const pgConfig = {
  host: process.env.PGHOST || "/cloudsql/myrandomwatch-b4b41:us-central1:firstpostpostdb",
  // host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  database: process.env.PGDATABASE || "yumyum",
  // password: process.env.PGPASSWORD || "mysecretpassword",
  password: process.env.PGPASSWORD || "3DdeMKqEsqyOE5jL",
};

const postgraphileOptions = {
  enhanceGraphiql: true,
  graphiql: true,
  appendPlugins: [ConnectionFilterPlugin, YumYumVenueAvailabilityPlugin],
  exportGqlSchemaPath: "../schema.graphql",

};

app.use(cors({
  origin: '*'
}));

app.use(postgraphile(pgConfig, "public", postgraphileOptions));

app.listen(8080);
