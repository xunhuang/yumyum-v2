
import {
  VendorBase,
  VenueVendorInfo,
} from "./VendorBase";

const buildUrl = require("build-url");

export class VendorResy extends VendorBase {
  vendorID() {
    return "resy";
  }

  requiedFieldsForReservation() {
    return ["businessid", "url_slug", "resy_city_code"];
  }

  getReservationUrl(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): string | null {
    let baseurl = `https://resy.com/cities/${venue.resy_city_code}/${venue.url_slug}`;

    let reservationUrl = buildUrl(baseurl, {
      queryParams: {
        date: date,
        seats: party_size,
      },
    });
    return reservationUrl;
  }
}
