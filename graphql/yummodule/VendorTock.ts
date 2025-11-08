import { TimeSlots, VendorBase, VenueVendorInfo } from "./VendorBase";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getRedisTockDb } from "../yumutil/src/saveToRedisWithChunking";

dayjs.extend(utc);
dayjs.extend(timezone);

const buildUrl = require("build-url");

export class VendorTock extends VendorBase {
  vendorID() {
    return "tock";
  }
  requiedFieldsForReservation() {
    return ["businessid", "url_slug"];
  }

  async venueSearch(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<TimeSlots[]> {
    const redis = getRedisTockDb();
    const response: any = await redis.get(`${venue.url_slug}-${date}`);

    let total: any = [];

    let slots = response;
    if (!slots) {
      throw new Error(`error finding tock reservation for venue ${venue.name}`);
    }

    slots.forEach(function (slot: any) {
      if (slot.availableTickets > 0) {
        // Osito's commual is ok...  otherwise skip communal
        if (venue.name !== "Osito" && slot.isCommunal) {
          return;
        }

        if (
          slot.minPurchaseSize <= party_size &&
          slot.maxPurchaseSize >= party_size
        ) {
          let datestr = dayjs
            .tz(date + "T" + slot.time, venue.timezone)
            .format();
          let ret: any = {
            time: datestr,
          };

          if (slot.ticketTypePrice && slot.ticketTypePrice.length > 0) {
            ret.priceInCents = slot.ticketTypePrice[0].priceCents;
          }
          total.push(ret);
        }
      }
    });

    return total;
  }

  getReservationUrl(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): string | null {
    let baseurl = `https://www.exploretock.com/${venue.url_slug}/search`;

    let reservationUrl = buildUrl(baseurl, {
      queryParams: {
        date: date,
        size: party_size,
        time: timeOption === "dinner" ? "19:00" : "12:00",
      },
    });
    return reservationUrl;
  }
}
