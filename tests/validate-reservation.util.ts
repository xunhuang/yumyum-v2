import { describe } from '@jest/globals';
import dayjs from 'dayjs';
import { getVendor } from '../graphql/yummodule/Vendors';
import { MetroAPI } from '../graphql/yummodule/MetroAPI';
import { VenueEntitySearchAll, VenueSearchInput } from '../graphql/yummodule/VenueSearchInput';
import { getMetroReservationList, setVenueReservationToTBD, updateVenueReservation } from './getYumYumGraphQLClient';

describe('Resolving reservation system for TBDs', () => {

  async function fixOpentableForMetro(metro: string) {

    const vendorString = "opentable";

    const result = await getMetroReservationList(metro, vendorString);
    console.log("result: ", result.data.allVenues?.totalCount);
    const tests = result.data.allVenues?.nodes?.slice(0, 100000);
    const date = dayjs().add(7, 'day').format('YYYY-MM-DD');


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
            await updateVenueReservation(key, info);
            // const b = JSON.parse(JSON.stringify(info));
            // b.key = key;
            // b.close = false;
            // b.withOnlineReservation = "true";
            // await client.mutate<UpdateVenueInfoMutation>({
            //   mutation: UpdateVenueInfoDocument,
            //   variables: b,
            // });
          } else {
            console.log("system need update: perhaps should set to TBD");
            await setVenueReservationToTBD(key);
            // console.log("system need update: perhaps should set to TBD");
            // const tbd = {
            //   key: key,
            //   reservation: "TBD",
            //   close: false,
            //   withOnlineReservation: "true",
            // }
            // console.log(tbd);
            // const r = await client.mutate<UpdateVenueInfoMutation>({
            //   mutation: UpdateVenueInfoDocument,
            //   variables: tbd,
            // });
          }
        }

        if (search_result) {
          console.log("updating reservation system")
          await updateReservatonSystem(test?.key!, search_result);
        }
      }
    }
  }

  describe('Lookup Reservation', () => {
    it('find all TBD places and determine reservation system', async () => {
      // await fixOpentableForMetro("bayarea");
      // await fixOpentableForMetro("sandiego");
      const metros = MetroAPI.all();
      for (const metro of metros) {
        console.log(`validaing metro area "${metro.key}"`);
        await fixOpentableForMetro(metro.key);
      }
    }, 1000000000)
  })
})
