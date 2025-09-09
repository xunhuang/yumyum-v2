import { RateLimiter } from "limiter";

import { TimeSlots, VendorBase, VenueVendorInfo } from "./VendorBase";
import { resyFindReservation } from "../yumutil/src";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const buildUrl = require("build-url");

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
    const data = await resyFindReservation(venue.businessid!, date, party_size);
    if (!data) {
      throw new Error(`error finding resy reservation for venue ${venue.name}`);
    }
    if (data.results.venues[0]) {
      const slots = data.results.venues[0].slots.map((s: any) => s.date.start);
      const uniqueSlots = [...new Set(slots)];

      const timeSlots: TimeSlots[] = uniqueSlots.map((slot) => ({
        time: dayjs.tz(slot as string, venue.timezone).format(),
      }));
      return timeSlots;
    }
    return [] as TimeSlots[];
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
