import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe, expect } from '@jest/globals';

import { JsonEntrySameWasDbEntry } from '../../../src/yummodule/JsonEntrySameWasDbEntry';
import { BayAreaDocument, BayAreaQuery, LookupReservationInfoDocument, LookupReservationInfoQuery, Venue } from '../../../src/generated/graphql';
import { VendorTock } from '../../../src/yummodule/VendorTock';
import { VendorOpentable } from '../../../src/yummodule/VendorOpentable';
import { VendorResy } from '../../../src/yummodule/VendorResy';

var tock = new VendorTock();
var opentable = new VendorOpentable();
var resy = new VendorResy();

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

            const searchAll = async (venue: any) => {
                const opentable_search_result = await opentable.entitySearchExactTerm(venue.name, venue.longitude, venue.latitude);
                if (opentable_search_result) {
                    return opentable_search_result;
                }

                const resy_search_result = await resy.entitySearchExactTerm(venue.name, venue.longitude, venue.latitude, venue);
                if (resy_search_result) {
                    return resy_search_result;
                }

                const tock_search_result = await tock.entitySearchExactTerm(venue.name, venue.longitude, venue.latitude, venue);
                if (tock_search_result) {
                    return tock_search_result;
                }
                return null;
            }

            for (const jsonentry of newOnly.slice(0, 10)) {
                const venue = {
                    longitude: jsonentry._geoloc.lng,
                    latitude: jsonentry._geoloc.lat,
                    name: jsonentry.name,
                    city: jsonentry.city.name,
                    state: jsonentry.region.name,
                    address: jsonentry._highlightResult.street.value,
                }

                const search_result = await searchAll(venue);

                if (search_result) {
                    console.log("found: ", jsonentry.name, search_result)
                } else {
                    console.log("not found: ", jsonentry.name)
                }
            }


        }, 100000)
    })
})

