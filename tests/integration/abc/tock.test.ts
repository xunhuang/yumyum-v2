import { describe } from '@jest/globals';

import { VendorTock } from '../../../src/yummodule/VendorTock';

const nyc = require("./nyc-tbd.json");

const bayarea = require("./bayarea.tock.json");

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

    it('list of entity (like fail because 5 second limit)', async () => {
      // for (const entity of nyc) {
      //   const search_result = await tock.entitySearchExactTerm(entity.name, entity.longitude, entity.latitude);
      //   // if (search_result) {
      //   console.log(entity.name, search_result)
      //   // }
      // }

      // for (const entity of bayarea.slice(0, 1)) {
      for (const entity of bayarea) {
        const search_result = await tock.entitySearchExactTerm(
          entity.name, entity.longitude, entity.latitude, entity);
        if (search_result) {
          console.log(entity.name, search_result);
        } else {
          console.log(entity.name, "not found **************************************");

        }
      }
    }, 100000)

  })
})
