import { describe, expect } from "@jest/globals";

import { VendorResy } from "../graphql/yummodule/VendorResy";
import { venueReservationSearchByKey } from "./getYumYumGraphQLClient";

const nyc = require("./nyc-tbd.json");

var resy = new VendorResy();
describe("Resy System Test", () => {
  beforeAll(async () => {
    return;
  });

  afterAll(async () => {
    // await dbTeardown()
  });

  describe("reservation search", () => {
    it("Testing for Resy API functioning ok", async () => {
      const search_result = await venueReservationSearchByKey(
        // "YUNn5L0CP1HjttnY7NU6" // heirloom cafe // not ok
        "2uTcvTYbn6lrFicXDhao" // the morris - OK....  what?
        // "aDjNTCZmZ9XMgJXPEAJo" // Utzutzu // not ok
      );

      // null means API error
      expect(search_result).not.toBeNull();
    });
  });
});
