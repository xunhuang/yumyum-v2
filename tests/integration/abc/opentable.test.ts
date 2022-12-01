import { describe } from '@jest/globals';

import { VendorOpentable } from '../../../src/yummodule/VendorOpentable';

const nyc = require("./nyc-tbd.json");

var opentable = new VendorOpentable();
describe('Opentable System Test', () => {


  const TarimindData = {
    address: "99 hudson street",
  }

  beforeAll(async () => {
    return;
  })

  afterAll(async () => {
    // await dbTeardown()
  })

  describe('Search entity by name and long/lat', () => {
    it('should find an entity with exact match', async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "Tamarind", -74.008865, 40.719215,
        TarimindData
      );
      expect(search_result.businessid).toEqual("41389");
    });

    it('should not find an entity with complete garbage', async () => {
      const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255, TarimindData);
      expect(search_result).toBeNull()
    })


    it('should find an entity with fuzzzy match', async () => {
      const search_result = await opentable.entitySearchExactTerm("Tam", -74.008865, 40.719215, TarimindData);
      expect(search_result.businessid).toEqual("41389");
    })

    it('should find an entity with fuzzzy match, case not match', async () => {
      const search_result = await opentable.entitySearchExactTerm("tam", -74.008865, 40.719215, TarimindData);
      expect(search_result.businessid).toEqual("41389");
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
