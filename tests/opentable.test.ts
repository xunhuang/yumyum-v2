import { describe } from "@jest/globals";

import { venueReservationSearchByKey } from "./getYumYumGraphQLClient";

describe("Opentable System Test", () => {
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
    }, 10000);
  });
});
