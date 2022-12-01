import { describe } from '@jest/globals';

import { VendorTock } from '../../../src/yummodule/VendorTock';

// const nyc = require("./nyc-tbd.json");
// const bayarea = require("./bayarea.tock.json");
const smallset = require("./tock.json");

var tock = new VendorTock();
describe('Tock System Test', () => {
  beforeAll(async () => {
    return;
  })

  afterAll(async () => {
    // await dbTeardown()
  })

  describe('Search entity by name and long/lat', () => {
    // it('should find an entity with exact match', async () => {
    //   const search_result = await tock.entitySearchExactTerm("Tamarind", -74.008865, 40.719215);
    //   console.log(search_result);
    //   expect(search_result.businessid).toEqual("41389");
    // });
    // it('should not find an entity with complete garbage', async () => {
    //   const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255);
    //   expect(search_result).toBeNull()
    // })
    // it('should find an entity with fuzzzy match', async () => {
    //   const search_result = await opentable.entitySearchExactTerm("Tam", -74.008865, 40.719215);
    //   expect(search_result.businessid).toEqual("41389");
    // })
    // it('should find an entity with fuzzzy match, case not match', async () => {
    //   const search_result = await opentable.entitySearchExactTerm("tam", -74.008865, 40.719215);
    //   expect(search_result.businessid).toEqual("41389");
    // })

    it('a small set that should find exact match)', async () => {
      for (const entity of smallset) {
        const search_result = await tock.entitySearchExactTerm(
          entity.name, entity.longitude, entity.latitude, entity);
        expect(search_result).not.toBeNull();
        expect(search_result.businessid).toEqual(entity.businessid);
        expect(search_result.urlSlug).toEqual(entity.urlSlug);
      }
    }, 100000)
  })
})
