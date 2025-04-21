import { describe } from "@jest/globals";

import { uspsLookupStreet } from "../yumutil/src";

describe("USPS System Test", () => {
  beforeAll(async () => {
    return;
  });
  afterAll(async () => {
    // await dbTeardown()
  });

  describe("Search entity by name and long/lat", () => {
    it("USPS API should work", async () => {
      let address = await uspsLookupStreet(
        "1735 Polk St.",
        "San Francisco",
        "CA"
      );
      expect(address).toEqual("1735 POLK ST");
    });

    it("USPS_API_should_rewrite_suffix", async () => {
      let address = await uspsLookupStreet(
        "239 Bannister Court",
        "Alameda",
        "CA"
      );
      expect(address).toEqual("239 BANNISTER CT");
    });

    // this test is failing because the API is not working
    // it("USPS API should work", async () => {
    //   let address = await uspsLookupStreet(
    //     // "7th avenue and, Dolores Street",
    //     "7th avenue and Dolores Street",
    //     "Carmel-by-the-Sea",
    //     "CA"
    //   );
    //   expect(address).toEqual("585 CREEDON CIR");
    // });
  });
});
