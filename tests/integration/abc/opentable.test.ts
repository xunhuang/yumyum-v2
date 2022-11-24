import { describe } from '@jest/globals';

import { VendorOpentable } from '../../../src/yummodule/VendorOpentable';

var opentable = new VendorOpentable();
describe('Opentable System Test', () => {
  beforeAll(async () => {
    return;
  })

  afterAll(async () => {
    // await dbTeardown()
  })

  // describe('Search entity by name and long/lat', () => {
  //   it('should find an entity with exact match', async () => {
  //     const search_result = await opentable.entitySearchExactTerm("Tamarind", -74.008865, 40.719215);
  //     expect(search_result.businessid).toEqual("41389");
  //   });

  //   it('should not find an entity with complete garbage', async () => {
  //     const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255);
  //     expect(search_result).toBeNull()
  //   })


  //   it('should find an entity with fuzzzy match', async () => {
  //     const search_result = await opentable.entitySearchExactTerm("Tam", -74.008865, 40.719215);
  //     expect(search_result.businessid).toEqual("41389");
  //   })

  //   it('should find an entity with fuzzzy match, case not match', async () => {
  //     const search_result = await opentable.entitySearchExactTerm("tam", -74.008865, 40.719215);
  //     expect(search_result.businessid).toEqual("41389");
  //   })

  // })
})
