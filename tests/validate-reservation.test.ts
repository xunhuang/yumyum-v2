import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { describe, expect } from '@jest/globals';
import dayjs from 'dayjs';

import { MetroReservationDocument, MetroReservationQuery, UpdateVenueInfoDocument, UpdateVenueInfoMutation } from '../src/generated/graphql';
import { getVendor } from '../src/yummodule/Vendors';
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
      // const tests = result.data.allVenues?.nodes?.slice(0, 10000).filter(x => x?.name?.includes("Burmatown"));
      const tests = result.data.allVenues?.nodes?.slice(0, 100000);
      const date = dayjs().add(7, 'day').format('YYYY-MM-DD');

      const vendorString = "opentable";

      for (const test of tests || []) {
        const venue: VenueSearchInput = {
          longitude: test?.longitude!,
          latitude: test?.latitude!,
          name: test?.name!,
          city: test?.city!,
          state: test?.region!,
          address: test?.address!,
          key: test?.key!,
          reservation: vendorString,
        }

        const vendor = getVendor(vendorString);

        const a: any = test;

        const res = await vendor.venueSearchSafe(a, date, 2, "dinner", true)
        if (!res) {
          const search_result = await VenueEntitySearchAll(venue);
          console.log(search_result);

          if (!search_result) {
            console.log(`${test?.name}: resevation system search threw exception`);
            continue;
          } else if (!search_result.opentable) {
            console.log(`${test?.name}: resevation system is no longer opentable `);
          } else if (search_result.opentable.businessid !== test?.businessid) {
            console.log(`${test?.name}: resevation system is opentable businessid changed ${test?.businessid} -> ${search_result.opentable.businessid} `);
          } else {
            console.log(`${test?.name}: not sure what failed`);
          }

          const updateReservatonSystem = async (key: string, reservationSearchResults: any) => {
            var info: any = null;
            if (reservationSearchResults.resy) {
              info = reservationSearchResults.resy;
            } else if (reservationSearchResults.tock) {
              info = reservationSearchResults.tock;
            } else if (reservationSearchResults.opentable) {
              info = reservationSearchResults.opentable;
            }

            if (info) {
              const b = JSON.parse(JSON.stringify(info));
              b.key = key;
              b.close = false;
              b.withOnlineReservation = "true";
              await client.mutate<UpdateVenueInfoMutation>({
                mutation: UpdateVenueInfoDocument,
                variables: b,
              });
            } else {
              console.log("system need update: perhaps should set to TBD");
              const tbd = {
                key: key,
                reservaton: "TBD",
                close: false,
                withOnlineReservation: "true",
              }
              await client.mutate<UpdateVenueInfoMutation>({
                mutation: UpdateVenueInfoDocument,
                variables: tbd,
              });
            }
          }

          if (search_result) {
            console.log("updating reservation system")
            await updateReservatonSystem(test?.key!, search_result);
          }
        }

      }

      expect(result.data.allVenues?.totalCount).toBeGreaterThan(0);
    }, 1000000000)
  })
})
