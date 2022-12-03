import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe, expect } from '@jest/globals';

import { LookupReservationInfoDocument, LookupReservationInfoQuery } from '../src/generated/graphql';

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

    describe('Lookup Reservation on server', () => {
        it('Lookup Tock reservation link meta info', async () => {
            const result = await client.query<LookupReservationInfoQuery>({
                query: LookupReservationInfoDocument, variables: { url: "https://www.exploretock.com/theshotasf/" }
            });
            expect(result.data.reservationInfo?.businessid).toEqual("13420");
        })
    })
})

