import cheerio from "cheerio";
import dayjs from "dayjs";
import { RateLimiter } from "limiter";
import { Cache, CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

import {
  TimeSlots,
  VendorBase,
  VenueReservationInfo,
  VenueVendorInfo,
} from "./VendorBase";
import { addressMatch, venueNameMatched } from "./venueNameMatched";
import { VenueSearchInput } from "./VenueSearchInput";
import {
  opentable_basic_search,
  opentable_basic_search_and_validate,
  opentableFindReservation,
} from "../../yumutil/src";

const nodefetch = require("node-fetch");
const buildUrl = require("build-url");
const moment = require("moment-timezone");
// eslint-disable-next-line
const userCache = new CacheContainer(new MemoryStorage());
const getDistance = require("geolib").getDistance;

// 5 requests per second so we don't overwhelm opentable's server
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 });

export class VendorOpentable extends VendorBase {
  vendorID() {
    return "opentable";
  }

  requiedFieldsForReservation() {
    return ["businessid"];
  }

  // async venueSearchInternal(
  //   businessid: string,
  //   date: string,
  //   party_size: number,
  //   timeOption: string
  // ): Promise<any> {
  //   return await opentableFindReservation(
  //     businessid,
  //     date,
  //     party_size,
  //     timeOption
  //   );
  // let token = await VendorOpentable.fetchAuthToken();
  // let url = "https://www.opentable.com/restref/api/availability?lang=en-US";
  // let datetime =
  //   timeOption === "dinner" ? date + "T19:00:00" : date + "T12:00:00";
  // let data = {
  //   rid: businessid,
  //   partySize: party_size,
  //   dateTime: datetime,
  //   enableFutureAvailability: false,
  // };
  // const w = await nodefetch(url, {
  //   method: "post",
  //   body: JSON.stringify(data),
  //   headers: {
  //     "Content-Type": "application/json;charset=UTF-8",
  //     authorization: `Bearer ${token}`,
  //   },
  // });

  // const json = await w.json();
  // return json;
  // }

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

  @Cache(userCache, { ttl: 60 * 60 })
  static async fetchAuthToken(): Promise<string> {
    // Inspired by https://www.vintnersresort.com/dining/john-ash-co/
    // https://www.opentable.com/restref/client?rid=1477&restref=1477&partysize=2&datetime=2022-10-31T19%3A00&lang=en-US&r3uid=TJkBfg-7J&ot_campaign=JA+Landing+Page&ot_source=Restaurant+website&color=1&modal=true'
    // let url = "https://www.opentable.com/restref/client?rid=1477&restref=1477&partysize=2&datetime=2025-04-31T19%3A00&lang=en-US&r3uid=TJkBfg-7J&ot_campaign=JA+Landing+Page&ot_source=Restaurant+website&color=1&modal=true";
    let url = `https://www.opentable.com/booking/restref/availability?rid=1477&restref=1477`;

    let data = {
      rid: "1477",
      restref: "1477",
      partysize: "2",
      datetime: "2023-10-31T19:00:00",
    };
    const w = await nodefetch(url + new URLSearchParams(data).toString());

    const res = await w.text();
    const $ = cheerio.load(res);

    let scripts = $("#client-initial-state");
    let json = cheerio(scripts).html();
    let config = JSON.parse(json!);
    if (!config) {
      throw new Error("No auth token found");
    }
    let token = config["authToken"];
    return token;
  }

  // similar to auth token, but this is  window.__CSRF_TOKEN__='d1f278be-aa32-4df0-990e-aa9e5a51cc71';
  // API for search is auto-complete

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

  // async _APIfetchAppConfig(url: string): Promise<any | null> {
  //   console.log("opentable: fetching app config", url);
  //   // URL should be like this:
  //   // `https://www.opentable.com/booking/restref/availability?rid=${businessid}&restref=${businessid}`;
  //   const w = await nodefetch(url, {
  //     method: "get",
  //     headers: {
  //       "Content-Type": "application/json;charset=UTF-8",
  //     },
  //   });
  //   const res = await w.text();
  //   const $ = cheerio.load(res);

  //   let scripts = $("#primary-window-vars").html();
  //   let windowVars = JSON.parse(scripts!);
  //   let appconfig = windowVars.windowVariables.__INITIAL_STATE__;
  //   // console.log(appconfig);
  //   return appconfig;
  // }

  // async _APIVenueLookup(businessid: string): Promise<any> {
  //   // let url = `https://www.opentable.com/restref/client?rid=${businessid}&restref=${businessid}`;
  //   let url = `https://www.opentable.com/booking/restref/availability?rid=${businessid}&restref=${businessid}`;
  //   const appconfig = await this._APIfetchAppConfig(url);
  //   if (appconfig) {
  //     return {
  //       address: appconfig?.restaurant?.address?.line1,
  //       city: appconfig?.restaurant?.address?.city,
  //       state: appconfig?.restaurant?.address?.state,
  //     };
  //   }
  //   return null;
  // }
}
