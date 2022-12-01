import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe } from '@jest/globals';

import { BayAreaDocument, BayAreaQuery, Venue } from '../../../src/generated/graphql';
import { JsonEntrySameWasDbEntry } from '../../../src/yummodule/JsonEntrySameWasDbEntry';
import { VenueEntitySearchAll, VenueSearchInput } from '../../../src/yummodule/VenueSearchInput';

var client: ApolloClient<NormalizedCacheObject>;

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
        it('Lookup new NYC info', async () => {
            const listFromJsonFile = require("../../../public/data/nyc.json");
            const first = await client.query<BayAreaQuery>({
                query: BayAreaDocument, variables: { metro: "nyc" }
            });

            const entrynodes = first.data?.allVenues?.nodes || [];
            const newOnly = listFromJsonFile.filter((jsonentry: any) => {
                const found = entrynodes.find(
                    (dbentry: Venue | any, index: number, thisobject: any) => {
                        return JsonEntrySameWasDbEntry(jsonentry, dbentry);
                    }
                );
                return !found;
            });

            for (const jsonentry of newOnly.slice(0, 10)) {
                const venue: VenueSearchInput = {
                    longitude: jsonentry._geoloc.lng,
                    latitude: jsonentry._geoloc.lat,
                    name: jsonentry.name,
                    city: jsonentry.city.name,
                    state: jsonentry.region.name,
                    address: jsonentry._highlightResult.street.value,
                }

                const search_result = await VenueEntitySearchAll(venue);

                if (search_result) {
                    console.log("found: ", jsonentry.name, search_result)
                } else {
                    console.log("not found: ", jsonentry.name)
                }
            }
        }, 100000)
    })
})

