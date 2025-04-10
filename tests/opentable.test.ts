import { describe } from "@jest/globals";

import { VendorOpentable } from "../graphql/yummodule/VendorOpentable";
import { VenueSearchInput } from "../graphql/yummodule/VenueSearchInput";
import { venueReservationSearchByKey } from "./getYumYumGraphQLClient";

var opentable = new VendorOpentable();
describe("Opentable System Test", () => {
  const testVenue: VenueSearchInput = {
    name: "Tamarine",
    latitude: 37.4490756,
    longitude: -122.1582014,
    address: "546 University Ave",
    city: "Palo Alto",
    state: "CA",
  };
  const testData = {
    input: testVenue,
    businessid: "2176",
  };

  describe("Search entity by name and long/lat", () => {
    it("search_entity_by_name_and_long_lat_exact_match", async () => {
      const search_result = await opentable.entitySearchExactTerm(
        testData.input.name,
        testData.input.longitude,
        testData.input.latitude,
        testData.input
      );
      expect(search_result?.businessid).toEqual(testData.businessid);
    });

    it("should not find an entity with complete garbage", async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "adadadfsfsdf2weweweAurum",
        testData.input.longitude,
        testData.input.latitude,
        testData.input
      );
      expect(search_result).toBeNull();
    });

    it("should find an entity with fuzzzy match", async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "Tam",
        testData.input.longitude,
        testData.input.latitude,
        testData.input
      );
      expect(search_result?.businessid).toEqual(testData.businessid);
    });

    it("should find an entity with fuzzzy match, case not match", async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "tam",
        testData.input.longitude,
        testData.input.latitude,
        testData.input
      );
      expect(search_result?.businessid).toEqual(testData.businessid);
    });
  });

  describe("reservation search", () => {
    it("Testing for Opentable API functioning ok", async () => {
      // ISA
      const search_result = await venueReservationSearchByKey(
        "pdeQcjD6o8T1qrfpfeA0"
      );
      // null means API error
      expect(search_result).not.toBeNull();
    });
    it("Testing for Yelp API functioning ok", async () => {
      // saltwater
      const search_result = await venueReservationSearchByKey(
        "c92IICLvjpnfKrZuMNg7"
      );
      // null means API error
      expect(search_result).not.toBeNull();
    });
  });
});
