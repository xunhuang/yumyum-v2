import { describe } from '@jest/globals';

import { uspsLookupStreet } from '../graphql/yummodule/uspsLookupStreet';
import { VendorTock } from '../graphql/yummodule/VendorTock';

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
