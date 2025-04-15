import { gotScraping } from "got-scraping";

import {
  TimeSlots,
  VendorBase,
  VenueVendorInfo,
} from "./VendorBase";

import dayjs from "dayjs";

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
    const response: any = await gotScraping.get({
      url: "https://us-west1-yumyum-v2.cloudfunctions.net/tock_redis",
      responseType: "json",
      headerGeneratorOptions: {
        browsers: [
          {
            name: "chrome",
            minVersion: 100, // 87
            maxVersion: 120, // 89
          },
        ],
        devices: ["desktop"],
        locales: ["de-DE", "en-US"],
        operatingSystems: ["windows", "linux"],
      },
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
      },
      searchParams: {
        date: date,
        party_size: party_size,
        venuetimezone: venue.timezone,
        businessId: venue.businessid,
        businessGroupId: venue.businessgroupid,
        urlSlug: venue.url_slug,
      },
    });

    let total: any = [];

    let slots = response.body;
    if (!slots) {
      return [];
    }

    slots.forEach(function (slot: any) {
      if (slot.availableTickets > 0) {
        // Osito's commual is ok...  otherwise skip communal
        if (venue.name !== "Osito" && slot.isCommunal) {
          return;
        }

        // Omakase is has extra non-dining experience that we don't want
        if (venue.name === "Omakase" && venue.key === "2VZHquW1dA6Gdv7m868O") {
          const ticketTypeId = slot.ticketTypePrice[0]?.ticketTypeId;
          // pickup or delivery experience not dine in experience
          if (ticketTypeId === 129690 || ticketTypeId === 275864) {
            return;
          }
        }

        if (
          slot.minPurchaseSize <= party_size &&
          slot.maxPurchaseSize >= party_size
        ) {
          let datestr = dayjs(date + " " + slot.time)
            .tz(venue.timezone)
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
