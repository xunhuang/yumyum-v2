import { describe } from '@jest/globals';

import { VendorOpentable } from '../src/yummodule/VendorOpentable';
import { VenueSearchInput } from '../src/yummodule/VenueSearchInput';

var opentable = new VendorOpentable();
describe('Opentable System Test', () => {

  const TamarindData: VenueSearchInput = {
    "name": "Tamarind",
    "latitude": 40.719215,
    "longitude": -74.008865,
    "address": "99 Hudson St.",
    "city": "New York",
    "state": "NY"
  }

  beforeAll(async () => {
    return;
  })

  afterAll(async () => {
    // await dbTeardown()
  })

  // describe('Debug problemmatic entry', () => {
  //   it('should find an entity with exact match', async () => {
    // maybe it's easier to debug with a venue key and fetch the venue data from the database.
  //     const search_result = await opentable.entitySearchExactTerm(
  //       "La Costanera", -122.51421, 37.54614,
  //     "name": "Tamarind",
  //   "latitude": 40.719215,
  //   "longitude": -74.008865,
  //   "address": "99 Hudson St.",
  //   "city": "New York",
  //   "state": "NY"
  //   );
  //     console.log(search_result)
  //     // expect(search_result?.businessid).toEqual("41389");
  //   });
  // });

  describe('Search entity by name and long/lat', () => {
    it('should find an entity with exact match', async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "Tamarind", -74.008865, 40.719215,
        TamarindData
      );
      expect(search_result?.businessid).toEqual("41389");
    });

    it('should not find an entity with complete garbage', async () => {
      const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255, TamarindData);
      expect(search_result).toBeNull()
    })


    it('should find an entity with fuzzzy match', async () => {
      const search_result = await opentable.entitySearchExactTerm("Tam", -74.008865, 40.719215, TamarindData);
      expect(search_result?.businessid).toEqual("41389");
    })

    it('should find an entity with fuzzzy match, case not match', async () => {
      const search_result = await opentable.entitySearchExactTerm("tam", -74.008865, 40.719215, TamarindData);
      expect(search_result?.businessid).toEqual("41389");
    })
    /*
    // should resurect this test when we have data for street.

    it('list of entity (like fail because 5 second limit)', async () => {
      for (const entity of nyc) {
        const search_result = await opentable.entitySearchExactTerm(entity.name, entity.longitude, entity.latitude);
        if (search_result) {
          console.log(entity.name, search_result)
        }
      }
    }, 100000)
    */

  })
})
