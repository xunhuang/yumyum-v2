import { VenueVendorInfo } from './yummodule/VendorBase';
import { singleVenueSearch, YumYumVenueAvailabilityPlugin } from './YumYumVenueAvailabilityPlugin';

const express = require("express");
const { postgraphile } = require("postgraphile");

const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const cors = require('cors');

const app = express();

const pgConfig = {
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  database: process.env.PGDATABASE || "yumyum",
  password: process.env.PGPASSWORD || "mysecretpassword",
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

// Need to add body-parser middleware to parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.post('/batchFindReservation', async (req: any, res: any) => {

  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();
  const writeLine = (obj: any) => {
    try {
      res.write(JSON.stringify(obj) + '\n');
    } catch (_e) {
    }
  };
  console.log("hello!");

  let date, party_size, timeOption, nodes;

  if (req.body) {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      ({ date, party_size, timeOption, nodes } = body);
      console.log('Parsed parameters:', { date, party_size, timeOption, nodes });
      for (const node of nodes) {
        const venue: VenueVendorInfo = {
          // these  came from the @requires 
          close: node.close,
          reservation: node.reservation,
          name: node.name,
          key: node.key,
          businessid: node.businessid,
          timezone: node.timezone,
          url_slug: node.urlSlug,
          latitude: node.latitude,
          longitude: node.longitude,
          resy_city_code: node.resyCityCode,
        };
        const slots = await singleVenueSearch(venue, date, party_size, timeOption);
        writeLine({ nodeName: node.name, reservation: node.reservation, slots });
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
    }
  }
  res.end();
});

app.listen(8080);