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

    // it('NYC TBD set )', async () => {
    //   for (const entity of nyc) {
    //     const search_result = await tock.entitySearchExactTerm(
    //       entity.name, entity.longitude, entity.latitude, entity);
    //     if (search_result) {
    //       console.log("found: ", entity.name, search_result);
    //     } else {
    //       console.log("********************* entity not found: " + entity.name);
    //     }
    //     // expect(search_result).not.toBeNull();
    //     // expect(search_result.businessid).toEqual(entity.businessid);
    //     // expect(search_result.urlSlug).toEqual(entity.urlSlug);
    //   }
    // }, 100000)

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
