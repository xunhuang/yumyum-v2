import { describe, expect } from "@jest/globals";

import { VendorResy } from "../graphql/yummodule/VendorResy";
import { VenueSearchInput } from "../graphql/yummodule/VenueSearchInput";
import { venueReservationSearchByKey } from "./getYumYumGraphQLClient";

const nyc = require("./nyc-tbd.json");

var resy = new VendorResy();
describe("Resy System Test", () => {
  const HeirloomData: VenueSearchInput = {
    name: "Heirloom Cafe SF",
    city: "San Francisco",
    address: "2500 Folsom St",
    latitude: 37.757116,
    longitude: -122.414713,
    state: "CA",
  };

  beforeAll(async () => {
    return;
  });

  afterAll(async () => {
    // await dbTeardown()
  });

  describe("Search entity by name and long/lat", () => {
    it("should find an entity with exact match", async () => {
      const search_result = await resy.entitySearchExactTerm(
        "heirloom",
        -122.414713,
        37.757116,
        HeirloomData
      );
      expect(search_result).not.toBeNull();
      expect(search_result!.businessid).toEqual("7074");
      expect(search_result!.urlSlug).toEqual("heirloom-cafe");
      expect(search_result!.resyCityCode).toEqual("sf");
    });

    it("should not find an entity with complete garbage", async () => {
      const search_result = await resy.entitySearchExactTerm(
        "adadadfsfsdf2weweweAurum",
        -122.1156105,
        37.3801255,
        HeirloomData
      );
      expect(search_result).toBeNull();
    });

    it("list of entity (like fail because 5 second limit)", async () => {
      for (const entity of nyc) {
        const search_result = await resy.entitySearchExactTerm(
          entity.name,
          entity.longitude,
          entity.latitude,
          HeirloomData
        );
        if (search_result) {
          console.log(entity.name, search_result);
        }
      }
    }, 100000);
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
