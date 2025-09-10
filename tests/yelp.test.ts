import { describe } from "@jest/globals";

import { venueReservationSearchByKey } from "./getYumYumGraphQLClient";

describe("Yelp System Test", () => {
  describe("reservation search", () => {
    it(
      "Testing for Yelp API functioning ok",
      async () => {
        // Example Yelp venue key (e.g., saltwater)
        const search_result = await venueReservationSearchByKey(
          "c92IICLvjpnfKrZuMNg7"
        );
        // null means API/proxy error
        expect(search_result).not.toBeNull();
      },
      20000
    );
  });
});

