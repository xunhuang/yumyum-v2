import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe } from '@jest/globals';

import { BayAreaDocument, BayAreaQuery, Venue } from '../graphql/generated/graphql';
import { JsonEntrySameWasDbEntry } from '../graphql/yummodule/JsonEntrySameWasDbEntry';
import { VenueEntitySearchBest, VenueSearchInput } from '../graphql/yummodule/VenueSearchInput';
import { getYumYumGraphQLClient } from './getYumYumGraphQLClient';

var client = getYumYumGraphQLClient();

describe('Testing calling GraphQL from apollo generated client', () => {
    beforeAll(async () => {
    })

    describe('Lookup new metros', () => {
        it('Lookup new NYC info', async () => {
            const listFromJsonFile = require("../public/data/nyc.json");
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

                const search_result = await VenueEntitySearchBest(venue);

                if (search_result) {
                    console.log("found: ", jsonentry.name, search_result)
                } else {
                    console.log("not found: ", jsonentry.name)
                }
            }
        }, 100000)
    })
})

