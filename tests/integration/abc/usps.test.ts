import { describe } from '@jest/globals';

import { uspsLookupStreet } from '../../../src/yummodule/uspsLookupStreet';
import { VendorTock } from '../../../src/yummodule/VendorTock';

const nyc = require("./nyc-tbd.json");

const bayarea = require("./bayarea.tock.json");

var tock = new VendorTock();
describe('USPS System Test', () => {
  beforeAll(async () => {
    return;
  })
  afterAll(async () => {
    // await dbTeardown()
  })

  describe('Search entity by name and long/lat', () => {
    it('USPS API should work', async () => {
      let address = await uspsLookupStreet("1735 Polk St.", "San Francisco", "CA");
      expect(address).toEqual("1735 POLK ST");
    });

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
      for (const entity of bayarea.slice(0, 2)) {
        const search_result = await tock.entitySearchExactTerm(
          entity.name, entity.longitude, entity.latitude, entity);
        if (!search_result) {
          console.log("********************* entity not found: " + entity.name);
        } else {
          console.log("found: ", entity.name, search_result);
        }
      }
    }, 100000);

  })
})
