import { TimeSlots, VendorBase, VenueVendorInfo } from "./VendorBase";
import { yelp_find_reservation } from "../yumutil/src/yelp_support";
import dayjs from "dayjs";

const buildUrl = require("build-url");

export class VendorYelp extends VendorBase {
  vendorID() {
    return "yelp";
  }

  requiedFieldsForReservation() {
    return ["businessid", "url_slug", "longitude", "latitude"];
  }

  async venueSearch(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<TimeSlots[]> {
    if (
      !venue.url_slug ||
      !venue.businessid ||
      !venue.longitude ||
      !venue.latitude
    ) {
      console.log("missing required fields for yelp venue", venue);
      return [];
    }

    const results = await yelp_find_reservation(
      venue.url_slug,
      venue.businessid,
      Number(venue.longitude),
      Number(venue.latitude),
      date,
      party_size,
      timeOption
    );

    let total: any = [];

    if (results.availability_data.length === 0) {
      return [];
    }
    let list = results.availability_data[0].availability_list;

    if (list.length === 0) {
      return [];
    }
    let slots = list;
    slots.forEach(function (slot: any) {
      let datestr = dayjs(slot.isodate).tz(venue.timezone).format();
      total.push({
        time: datestr,
      });
    });
    return total;
  }

  getReservationUrl(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): string | null {
    let url = `https://www.yelp.com/reservations/${venue.url_slug}`;
    let reservationUrl = buildUrl(url, {
      queryParams: {
        date: date,
        covers: party_size,
        from_reserve_now: 1,
        time: timeOption === "dinner" ? 1900 : 1200,
      },
    });
    return reservationUrl;
  }
}
