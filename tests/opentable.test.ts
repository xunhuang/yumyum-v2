import { describe } from '@jest/globals';

import { VendorOpentable } from '../graphql/yummodule/VendorOpentable';
import { VenueSearchInput } from '../graphql/yummodule/VenueSearchInput';
import { venueReservationSearchByKey } from './getYumYumGraphQLClient';

var opentable = new VendorOpentable();
describe('Opentable System Test', () => {

  const TamarindData: VenueSearchInput = {
    "name": "Tamarind",
    "latitude": 40.719215,
    "longitude": -74.008865,
    "address": "99 Hudson St.",
    "city": "New York",
    "state": "NY"
  }

  describe('Search entity by name and long/lat', () => {
    it('should find an entity with exact match', async () => {
      const search_result = await opentable.entitySearchExactTerm(
        "Tamarind", -74.008865, 40.719215,
        TamarindData
      );
      expect(search_result?.businessid).toEqual("41389");
    });

    it('should not find an entity with complete garbage', async () => {
      const search_result = await opentable.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255, TamarindData);
      expect(search_result).toBeNull()
    })

    it('should find an entity with fuzzzy match', async () => {
      const search_result = await opentable.entitySearchExactTerm("Tam", -74.008865, 40.719215, TamarindData);
      expect(search_result?.businessid).toEqual("41389");
    })

    it('should find an entity with fuzzzy match, case not match', async () => {
      const search_result = await opentable.entitySearchExactTerm("tam", -74.008865, 40.719215, TamarindData);
      expect(search_result?.businessid).toEqual("41389");
    })
  })

  describe('reservation search', () => {
    it('Testing for Opentable API functioning ok', async () => {
      // ISA
      const search_result = await venueReservationSearchByKey("pdeQcjD6o8T1qrfpfeA0");
      // null means API error
      expect(search_result).not.toBeNull();
    })
    it('Testing for Yelp API functioning ok', async () => {
      // saltwater
      const search_result = await venueReservationSearchByKey("c92IICLvjpnfKrZuMNg7");
      // null means API error
      expect(search_result).not.toBeNull();
    })
  });
})
