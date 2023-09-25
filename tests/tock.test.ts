import { describe } from '@jest/globals';
import dayjs from 'dayjs';

import { VendorTock } from '../graphql/yummodule/VendorTock';
import { venueReservationSearchByKey, venueToVendorInfo, yumyumVenueByKey } from './getYumYumGraphQLClient';

const smallset = require("./tock.json");

var tock = new VendorTock();

describe('Tock System Test', () => {

  it('fetch entity info via Url', async () => {
    const info = await tock.fetchReservationInfoFromURL("https://www.exploretock.com/theshotasf/");
    console.log(info);
    expect(info?.reservation).toBe("tock")
    expect(info?.businessid).toBe(13420);
    expect(info?.urlSlug).toBe("theshotasf");
  });

  // this one has a strange communal flag...
  it('investigate Osito', async () => {
    const result = await yumyumVenueByKey("4vC2zTU1hBOBNnyyEReU4");
    const search_result = await tock.venueSearchSafe(
      venueToVendorInfo(result?.data?.venueByKey!),
      dayjs().add(7, 'day').format('YYYY-MM-DD'), // "2022-12-22",
      2, "dinner", true,
    );
    expect(search_result).not.toBeNull();
  })

  // this one has a take-out order
  it('investigate omakase', async () => {
    const search_result = await venueReservationSearchByKey("2VZHquW1dA6Gdv7m868O");
    expect(search_result).not.toBeNull();
  })

  describe('Search entity by name and long/lat', () => {
    it('A small set that should find exact match, using dual systems)', async () => {
      for (const entity of smallset) {
        const search_result = await tock.entitySearchExactTerm(
          entity.name, entity.longitude, entity.latitude, entity);
        console.log(entity.name, search_result);
        expect(search_result).not.toBeNull();
        expect(search_result?.businessid).toEqual(entity.businessid);
        expect(search_result?.urlSlug).toEqual(entity.urlSlug);
      }
    }, 100000)

  })
})
