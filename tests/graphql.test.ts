import { describe, expect } from '@jest/globals';

import { LookupReservationInfoDocument, LookupReservationInfoQuery } from '../src/generated/graphql';
import { getYumYumGraphQLClient } from './getYumYumGraphQLClient';

var client = getYumYumGraphQLClient();

describe('Testing calling GraphQL from apollo generated client', () => {
    beforeAll(async () => {
    })

    describe('Lookup Reservation on server', () => {
        /*
        it('Lookup Resy reservation link meta info', async () => {
            const result = await client.query<LookupReservationInfoQuery>({
                query: LookupReservationInfoDocument, variables: { url: "https://resy.com/cities/sf/robin?date=2023-01-08&seats=2" }
            });
            expect(result.data.reservationInfo?.businessid).toEqual("1362");
            expect(result.data.reservationInfo?.urlSlug).toEqual("robin");
            expect(result.data.reservationInfo?.resyCityCode).toEqual("sf");
        })
        */
        it('Lookup Tock reservation link meta info', async () => {
            const result = await client.query<LookupReservationInfoQuery>({
                query: LookupReservationInfoDocument, variables: { url: "https://www.exploretock.com/theshotasf/" }
            });
            console.log(result);
            expect(result.data.reservationInfo?.businessid).toEqual("13420");
        })
    })
})

