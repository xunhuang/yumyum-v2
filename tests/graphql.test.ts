import { describe, expect } from '@jest/globals';

import { LookupReservationInfoDocument, LookupReservationInfoQuery } from '../src/generated/graphql';
import { getYumYumGraphQLClient } from './getYumYumGraphQLClient';

var client = getYumYumGraphQLClient();

describe('Testing calling GraphQL from apollo generated client', () => {
    beforeAll(async () => {
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

