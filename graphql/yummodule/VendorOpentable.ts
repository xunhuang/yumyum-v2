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

  async venueSearchInternal(
    businessid: string,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<any> {
    let token = await VendorOpentable.fetchAuthToken();
    let url = "https://www.opentable.com/restref/api/availability?lang=en-US";
    let datetime =
      timeOption === "dinner" ? date + "T19:00:00" : date + "T12:00:00";
    let data = {
      rid: businessid,
      partySize: party_size,
      dateTime: datetime,
      enableFutureAvailability: false,
    };
    const w = await nodefetch(url, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    });

    const json = await w.json();
    return json;
  }

  async venueSearch(
    venue: VenueVendorInfo,
    date: string,
    party_size: number,
    timeOption: string
  ): Promise<TimeSlots[]> {
    await limiter.removeTokens(1);
    let resbody = await this.venueSearchInternal(
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
      console.log(res);
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
    // note that this is the built-in version and not the same as the node-fetch API
    const result = await fetch(
      "https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete",
      {
        headers: {
          // don't uncomment this.... it will fail
          // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
          "content-type": "application/json",
          // "x-csrf-token": "eda2a880-4591-44e3-b7e0-9f7f03079bd3",
          "x-csrf-token": "ec7cfeef-a047-461c-960d-4ab44ce2688a",
        },
        body: JSON.stringify({
          operationName: "Autocomplete",
          variables: {
            term: term,
            latitude: latitude,
            longitude: longitude,
            useNewVersion: true,
          },
          extensions: {
            persistedQuery: {
              version: 1,
              // sha256Hash: "3cabca79abcb0db395d3cbebb4d47d41f3ddd69442eba3a57f76b943cceb8cf4"
              // below updated on 2025-04-10
              sha256Hash:
                "fe1d118abd4c227750693027c2414d43014c2493f64f49bcef5a65274ce9c3c3",
            },
          },
        }),
        method: "POST",
      }
    );

    var response: any;
    try {
      response = (await result.json()).data.autocomplete.autocompleteResults;
    } catch (e) {
      console.log("Opentable: error parsing response from search API", e);
      return null;
    }

    console.log(response);

    if (response.length === 0) {
      return null;
    }

    // sort results by distance
    const sorted = response.sort((a: any, b: any) => {
      let a_d = getDistance(
        { latitude: a?.latitude || 0, longitude: a?.longitude || 0 },
        { latitude: latitude, longitude: longitude }
      );
      let b_d = getDistance(
        { latitude: b?.latitude || 0, longitude: b?.longitude || 0 },
        { latitude: latitude, longitude: longitude }
      );
      return a_d - b_d;
    });

    const validateResult = async (businessid: string): Promise<boolean> => {
      try {
        const result = await this.venueSearchInternal(
          businessid,
          dayjs().add(7, "day").format("YYYY-MM-DD"),
          2,
          "dinner"
        );
        if (result.availability?.error?.message === "NOT_AVAILABLE") {
          console.log("opentable No longer available", businessid);
          return false;
        }
      } catch (e) {
        console.log("opentable validation exception.....", businessid);
        console.log(e);
        return false;
      }
      return true;
    };

    const makeResult = (candidate: any) => {
      return {
        name: candidate.name,
        reservation: this.vendorID(),
        businessid: candidate.id,
      };
    };

    for (const entry of sorted.slice(0, 10)) {
      // distance in meters
      const distance = getDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: entry.latitude, longitude: entry.longitude }
      );

      if (distance > 3500) {
        console.log("opentable: distance too far", distance);
        continue;
      }

      if (venueNameMatched(term, entry.name)) {
        if (await validateResult(entry.id)) {
          return makeResult(entry);
        } else {
          console.log(
            "opentable: can't avalidate entry - keep working ",
            entry.id
          );
        }
      } else {
        console.log(
          "opentable: name not matched, continue to working",
          entry.name
        );
      }

      const location = await this._APIVenueLookup(entry.id);
      if (
        location &&
        (await addressMatch(
          location.address,
          extra.address,
          location.city,
          location.state
        ))
      ) {
        if (await validateResult(entry.id)) {
          return makeResult(entry);
        }
      } else {
        if (!location) {
          console.log("opentable: location not found", entry.id);
        } else {
          console.log(
            "opentable: location found but address not matched",
            location.address,
            extra.address
          );
        }
      }
      console.log("giving up on this entry", entry.name);
    }
    return null;
  }

  async _APIfetchAppConfig(url: string): Promise<any | null> {
    console.log("opentable: fetching app config", url);
    // URL should be like this:
    // `https://www.opentable.com/booking/restref/availability?rid=${businessid}&restref=${businessid}`;
    const w = await nodefetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    const res = await w.text();
    const $ = cheerio.load(res);

    let scripts = $("#primary-window-vars").html();
    let windowVars = JSON.parse(scripts!);
    let appconfig = windowVars.windowVariables.__INITIAL_STATE__;
    // console.log(appconfig);
    return appconfig;
  }

  async _APIVenueLookup(businessid: string): Promise<any> {
    // let url = `https://www.opentable.com/restref/client?rid=${businessid}&restref=${businessid}`;
    let url = `https://www.opentable.com/booking/restref/availability?rid=${businessid}&restref=${businessid}`;
    const appconfig = await this._APIfetchAppConfig(url);
    if (appconfig) {
      return {
        address: appconfig?.restaurant?.address?.line1,
        city: appconfig?.restaurant?.address?.city,
        state: appconfig?.restaurant?.address?.state,
      };
    }
    return null;
  }
}
