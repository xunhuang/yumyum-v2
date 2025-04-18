import { RateLimiter } from "limiter";

import {
  TimeSlots,
  VendorBase,
  VenueVendorInfo,
} from "./VendorBase";

const buildUrl = require("build-url");

const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 }); // 1 request per second;

export class VendorResy extends VendorBase {
  vendorID() {
    return "resy";
  }

  requiedFieldsForReservation() {
    return ["businessid", "url_slug", "resy_city_code"];
  }

  async venueSearch(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<TimeSlots[]> {
    await limiter.removeTokens(1);

    const url = new URL("https://us-west1-yumyum-v2.cloudfunctions.net/resy_1");
    url.searchParams.append("businessid", venue.businessid!);
    url.searchParams.append("party_size", party_size.toString());
    url.searchParams.append("date", date);
    url.searchParams.append("timezone", venue.timezone!);
    url.searchParams.append("url_slug", venue.url_slug!);

    console.log(url.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    console.log(data);
    return data;
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
