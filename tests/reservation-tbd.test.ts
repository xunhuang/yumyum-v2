import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe, expect } from '@jest/globals';

import {
  UpdateVenueInfoDocument,
  UpdateVenueInfoMutation,
  UsaReservationTbdDocument,
  UsaReservationTbdQuery,
} from '../src/generated/graphql';
import { VenueEntitySearchAll, VenueSearchInput } from '../src/yummodule/VenueSearchInput';

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
      const result = await client.query<UsaReservationTbdQuery>({
        query: UsaReservationTbdDocument
      });
      console.log("result: ", result.data.allVenues?.totalCount);
      const tests = result.data.allVenues?.nodes?.slice(0, 1);
      for (const test of tests || []) {
        const venue: VenueSearchInput = {
          longitude: test?.longitude!,
          latitude: test?.latitude!,
          name: test?.name!,
          city: test?.city!,
          state: test?.region!,
          address: test?.address!,
        }

        const search_result = await VenueEntitySearchAll(venue);

        if (search_result && search_result.reservation) {
          console.log("found: ", test?.name, search_result)
          const b = JSON.parse(JSON.stringify(search_result));
          // const vendor = getVendor(search_result.reservation);
          b.key = test?.key!;
          b.close = false;
          b.withOnlineReservation = "true";

          console.log(b);
          // throw ("stop");

          const updateresult = await client.mutate<UpdateVenueInfoMutation>({
            mutation: UpdateVenueInfoDocument,
            variables: b,
          });
          console.log(updateresult);

        } else {
          console.log("not found: ", test?.name)
        }
      }

      expect(result.data.allVenues?.totalCount).toBeGreaterThan(0);
    }, 100000)
  })
})
