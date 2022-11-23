import { describe } from '@jest/globals';

import { VendorOpentable } from '../../../src/yummodule/VendorOpentable';

const nyc = require("./nyc-tbd.json");

var opentable = new VendorOpentable();
describe('Resy System Test', () => {
  beforeAll(async () => {
    return;
  })

  afterAll(async () => {
    // await dbTeardown()
  })

  describe('Search entity by name and long/lat', () => {
    it('should find an entity with exact match', async () => {
      const search_result = await opentable.entitySearchExactTerm("Tamarind",
        -74.008865,
        40.719215);
      console.log(search_result);

      // expect(search_result.businessid).toEqual(49088);
      // expect(search_result.urlSlug).toEqual("aurum");
      // expect(search_result.resyCityCode).toEqual("lsl");
    })

    /*
    it('should not find an entity with complete garbage', async () => {
      const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255);
      expect(search_result).toBeNull()
    })

    it('should find an entity with fuzzzy match', async () => {
      const search_result = await opentable.entitySearchExactTerm("Au", -122.1156105, 37.3801255);
      expect(search_result.urlSlug).toEqual("aurum");
    })

    it('should find an entity with fuzzzy match, case not match', async () => {
      const search_result = await opentable.entitySearchExactTerm("au", -122.1156105, 37.3801255);
      expect(search_result.urlSlug).toEqual("aurum");
    })
    it('list of entity (like fail because 5 second limit)', async () => {
      for (const entity of nyc) {
        const search_result = await opentable.entitySearchExactTerm(entity.name, entity.longitude, entity.latitude);
        console.log(entity.name, search_result)
      }
    })
    */
  })
})
