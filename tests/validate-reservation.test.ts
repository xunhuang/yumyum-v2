import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe, expect } from '@jest/globals';

import { MetroReservationDocument, MetroReservationQuery } from '../src/generated/graphql';
import { VenueEntitySearchAll, VenueSearchInput } from '../src/yummodule/VenueSearchInput';

var client: ApolloClient<NormalizedCacheObject>;

describe('Resolving reservation system for TBDs', () => {
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

  describe('Lookup Reservation', () => {
    it('find all TBD places and determine reservation system', async () => {
      const result = await client.query<MetroReservationQuery>({
        query: MetroReservationDocument,
        variables: {
          metro: "bayarea",
          reservation: "opentable"
        },
      });
      console.log("result: ", result.data.allVenues?.totalCount);
      // const tests = result.data.allVenues?.nodes?.slice(0, 10000).filter(x => x?.name?.includes("Noosh"));
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

        console.log(test?.name);
        const search_result = await VenueEntitySearchAll(venue);
        // console.log(search_result);

        if (!search_result) {
          console.log(`${test?.name}: resevation system not found`);
        } else if (!search_result.opentable) {
          console.log(`${test?.name}: resevation system is no longer opentable `);
          console.log(search_result);
        } else if (search_result.opentable.businessid !== test?.businessid) {
          console.log(`${test?.name}: resevation system is opentable businessid changed ${test?.businessid} -> ${search_result.opentable.businessid} `);
        }

        // if (search_result && search_result.reservation) {
        //   console.log("found: ", test?.name, search_result)
        //   const b = JSON.parse(JSON.stringify(search_result));
        //   b.key = test?.key!;
        //   b.close = false;
        //   b.withOnlineReservation = "true";

        //   const updateresult = await client.mutate<UpdateVenueInfoMutation>({
        //     mutation: UpdateVenueInfoDocument,
        //     variables: b,
        //   });
        //   console.log(updateresult);

        // } else {
        //   console.log("not found: ", test?.name)
        // }
      }

      expect(result.data.allVenues?.totalCount).toBeGreaterThan(0);
    }, 1000000000)
  })
})
