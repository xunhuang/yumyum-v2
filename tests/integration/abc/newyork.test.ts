import { describe } from '@jest/globals';
import { VenueEntitySearchAll, VenueSearchInput } from '../../../src/yummodule/VenueSearchInput';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { BayAreaDocument, BayAreaQuery, Venue } from '../../../src/generated/graphql';
import { JsonEntrySameWasDbEntry } from '../../../src/yummodule/JsonEntrySameWasDbEntry';

var client: ApolloClient<NormalizedCacheObject>;

const nyc = require("./nyc-tbd.json");

describe('Testing calling GraphQL from apollo generated client', () => {
    beforeAll(async () => {

        const cache = new InMemoryCache();
        client = new ApolloClient({
            uri:
                process.env.REACT_APP_GRAPHQL_ENDPOINT ||
                "https://graph-3khoexoznq-uc.a.run.app/graphql",
            cache: cache,
            connectToDevTools: true,
        });
    })
    describe('Lookup new metros', () => {
        it('Lookup NYC 2021 TBD', async () => {
            for (const entry of nyc.slice(0, 100)) {
                const venue: VenueSearchInput = {
                    longitude: entry.longitude,
                    latitude: entry.latitude,
                    name: entry.name,
                    city: entry.city,
                    state: entry.region, // note it's not entry.state
                    address: entry.address,
                }

                const search_result = await VenueEntitySearchAll(venue);
                if (search_result) {
                    console.log("found: ", entry.name, search_result)
                } else {
                    console.log("not found: ", entry.name)
                }
            }
        }, 100000)
    })

})


