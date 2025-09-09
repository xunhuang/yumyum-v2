import { RateLimiter } from "limiter";

import {
  TimeSlots,
  VendorBase,
  VenueVendorInfo,
} from "./VendorBase";
import { opentableFindReservation } from "../yumutil/src";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const buildUrl = require("build-url");

// 5 requests per second so we don't overwhelm opentable's server
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 });

export class VendorOpentable extends VendorBase {
  vendorID() {
    return "opentable";
  }

  requiedFieldsForReservation() {
    return ["businessid"];
  }

  async venueSearch(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<TimeSlots[]> {
    await limiter.removeTokens(1);
    let resbody = await opentableFindReservation(
      venue.businessid!,
      date,
      party_size,
      timeOption
    );
    if (!resbody) {
      throw new Error(`error finding opentable reservation for venue ${venue.name}`);
    }
    let total: TimeSlots[] = [];
    resbody.forEach(function (slot: string) {
      let datestr = dayjs.tz(slot, venue.timezone)
        .format();
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
    let url = `https://www.opentable.com/restaurant/profile/${venue.businessid}/reserve`;
    let datestr = timeOption === "dinner" ? date + "T19:00" : date + "T12:00";
    let reservationUrl = buildUrl(url, {
      queryParams: {
        rid: venue.businessid,
        restref: venue.businessid,
        datetime: datestr,
        covers: party_size,
      },
    });
    return reservationUrl;
  }
}
