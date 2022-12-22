import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe } from '@jest/globals';
import dayjs from 'dayjs';
import { LookupReservationInfoDocument, VenueByKeyDocument, VenueByKeyQuery } from '../src/generated/graphql';

import { VendorTock } from '../src/yummodule/VendorTock';

const smallset = require("./tock.json");

var client: ApolloClient<NormalizedCacheObject>;

var tock = new VendorTock();

describe('Tock System Test', () => {
  beforeAll(async () => {
    const cache = new InMemoryCache();
    client = new ApolloClient({
      uri:
        process.env.REACT_APP_GRAPHQL_ENDPOINT ||
        "https://graph-3khoexoznq-uc.a.run.app/graphql",
      cache: cache,
      connectToDevTools: true,
    });

    return;
  })

  afterAll(async () => {
  })

  // this one has a strange communal flag...
  it('investigate Osito', async () => {
    const result = await client.query<VenueByKeyQuery>({
      query: VenueByKeyDocument,
      variables: {
        key: "4vC2zTU1hBOBNnyyEReU4",
      },
    });
    const search_result = await tock.venueSearchSafe(
      {
        key: result?.data?.venueByKey?.key!,
        name: result?.data?.venueByKey?.name!,
        reservation: result?.data?.venueByKey?.reservation!,
        businessid: result?.data?.venueByKey?.businessid!,
      },
      dayjs().add(7, 'day').format('YYYY-MM-DD'), // "2022-12-22",
      2, "dinner"
    );
  })

  // this one has a take-out order
  it('investigate omakase', async () => {
    const result = await client.query<VenueByKeyQuery>({
      query: VenueByKeyDocument,
      variables: {
        key: "2VZHquW1dA6Gdv7m868O",
      },
    });
    const search_result = await tock.venueSearchSafe(
      {
        key: result?.data?.venueByKey?.key!,
        name: result?.data?.venueByKey?.name!,
        reservation: result?.data?.venueByKey?.reservation!,
        businessid: result?.data?.venueByKey?.businessid!,
      },
      dayjs().add(7, 'day').format('YYYY-MM-DD'), // "2022-12-22",
      2, "dinner"
    );
  })

  describe('Search entity by name and long/lat', () => {

    it('A small set that should find exact match, using dual systems)', async () => {
      for (const entity of smallset) {
        const search_result = await tock.entitySearchExactTerm(
          entity.name, entity.longitude, entity.latitude, entity);
        expect(search_result).not.toBeNull();
        expect(search_result?.businessid).toEqual(entity.businessid);
        expect(search_result?.urlSlug).toEqual(entity.urlSlug);
      }
    }, 100000)

  })
})
