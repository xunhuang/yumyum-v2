import { describe, expect } from '@jest/globals';

import {
  UpdateVenueInfoDocument,
  UpdateVenueInfoMutation,
  UsaReservationTbdDocument,
  UsaReservationTbdQuery,
} from '../graphql/generated/graphql';
import { VenueEntitySearchBest, VenueSearchInput } from '../graphql/yummodule/VenueSearchInput';
import { getYumYumGraphQLClient } from './getYumYumGraphQLClient';

var client = getYumYumGraphQLClient();

describe('Resolving reservation system for TBDs', () => {
  describe('Lookup Reservation', () => {
    it('find all TBD places and determine reservation system', async () => {
      const result = await client.query<UsaReservationTbdQuery>({
        query: UsaReservationTbdDocument
      });
      console.log("result: ", result.data.allVenues?.totalCount);
      const tests = result.data.allVenues?.nodes?.slice(0, 10000);
      for (const test of tests || []) {
        const venue: VenueSearchInput = {
          longitude: test?.longitude!,
          latitude: test?.latitude!,
          name: test?.name!,
          city: test?.city!,
          state: test?.region!,
          address: test?.address!,
        }

        const search_result = await VenueEntitySearchBest(venue);

        if (search_result && search_result.reservation) {
          console.log("found: ", test?.name, search_result)
          const b = JSON.parse(JSON.stringify(search_result));
          b.key = test?.key!;
          b.close = false;
          b.withOnlineReservation = "true";

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
    }, 1000000000)
  })
})
