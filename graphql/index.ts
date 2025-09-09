import { myCache } from './myCache';
import { VendorAPIErrorBuckets } from './VendorAPIErrorBuckets';
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


  if (req.body) {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { date, party_size, timeOption, nodes } = body;
      const concurrency = 10;

      // Create a queue of all nodes to process
      const queue = [...nodes];

      // Process nodes with max concurrency
      const activePromises = new Set();

      // Helper function to process a single node
      const processNode = async (node: any) => {
        const venue: VenueVendorInfo = {
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
        const cacheKey = JSON.stringify({ key: venue.key, date, party_size, timeOption });
        let slots = myCache.get(cacheKey);
        if (slots === undefined) {
          slots = await singleVenueSearch(venue, date, party_size, timeOption);
          myCache.set(cacheKey, slots);
        }
        writeLine({ nodeName: node.name, key: node.key, reservation: node.reservation, slots });
      };

      // Process queue with concurrency control
      while (queue.length > 0 || activePromises.size > 0) {
        // Fill up to max concurrency
        while (queue.length > 0 && activePromises.size < concurrency) {
          const node = queue.shift()!;
          const promise = processNode(node).then(() => {
            activePromises.delete(promise);
          });
          activePromises.add(promise);
        }
        // Wait for at least one promise to complete
        if (activePromises.size > 0) {
          await Promise.race(activePromises);
        }
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
    }
  }
  res.end();
});

app.get('/api/vendor-error-rates', (_req: any, res: any) => {
  const rates: { [key: string]: { errors: number; total: number; rate: number } } = {};

  for (const [vendor, bucket] of VendorAPIErrorBuckets.entries()) {
    rates[vendor] = bucket.errorRate();
  }

  res.json(rates);
});



app.listen(8080);