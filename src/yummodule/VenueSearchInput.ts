import { VendorMap } from './Vendors';

export type VenueSearchInput = {
  longitude: number;
  latitude: number;
  name: string;
  city: string;
  state: string;
  address: string;
};

export const VenueEntitySearchAll = async (venue: VenueSearchInput) => {
  const name = venue.name;

  const opentable_search_result = await VendorMap.opentable.entitySearchExactTerm(name, venue.longitude, venue.latitude, venue);
  if (opentable_search_result) {
    return opentable_search_result;
  }

  const resy_search_result = await VendorMap.resy.entitySearchExactTerm(name, venue.longitude, venue.latitude, venue);
  if (resy_search_result) {
    return resy_search_result;
  }

  const tock_search_result = await VendorMap.tock.entitySearchExactTerm(name, venue.longitude, venue.latitude, venue);
  if (tock_search_result) {
    return tock_search_result;
  }
  return null;
}