import cheerio from "cheerio";
import { RateLimiter } from "limiter";

import {
  TimeSlots,
  VendorBase,
  VenueReservationInfo,
  VenueVendorInfo,
} from "./VendorBase";
import { VenueSearchInput } from "./VenueSearchInput";
import {
  opentable_basic_search_and_validate,
  opentableFindReservation,
} from "../yumutil/src";

const nodefetch = require("node-fetch");
const buildUrl = require("build-url");
const moment = require("moment-timezone");

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
    if (typeof resbody.availability == "undefined") {
      return [];
    }
    let slots = resbody.availability[date].timeSlots;
    let total: TimeSlots[] = [];
    slots.forEach(function (slot: any) {
      let datestr = moment
        .tz(slot.dateTime.substr(0, 19), venue.timezone)
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

  async fetchReservationInfoFromURL(
    url: string
  ): Promise<VenueReservationInfo | null> {
    const w = await nodefetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    const res = await w.text();
    const $ = cheerio.load(res);

    let scripts = $("script")
      .map(function (i, el) {
        let text = cheerio(el).html();
        if (text?.includes("window.__INITIAL_STATE__=")) {
          let texts = text.split("\n");
          return texts
            .map(function (t) {
              if (t.includes("window.__INITIAL_STATE__=")) {
                const a = t
                  .replace("window.__INITIAL_STATE__=", "")
                  .replace(/;$/g, "");
                // console.log(a);
                return a;
              }
              return "";
            })
            .join("");
        }
        return "";
      })
      .get()
      .join(" ");

    const clean = scripts.replace(/;$/g, "");
    let appconfig = JSON.parse(clean);
    return {
      reservation: this.vendorID(),
      businessid: appconfig.restaurantProfile.restaurant.restaurantId,
    };
  }

  async entitySearchExactTerm(
    term: string,
    longitude: number,
    latitude: number,
    extra: VenueSearchInput
  ): Promise<VenueReservationInfo | null> {
    const result1 = await opentable_basic_search_and_validate(
      term,
      longitude,
      latitude,
      ""
    );
    if (!result1) {
      return null;
    }
    const finalResult: VenueReservationInfo | null = {
      reservation: this.vendorID(),
      businessid: result1!,
    };
    return finalResult;
  }
}
