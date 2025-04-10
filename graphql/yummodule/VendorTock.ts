import cheerio from "cheerio";
import { gotScraping } from "got-scraping";

import {
  deserializeTockSearchResponseProtoToMsg,
  newTockSearchRequest,
  serializeMsgToProto,
} from "./tockRequestMsg";
import {
  TimeSlots,
  VendorBase,
  VenueReservationInfo,
  VenueVendorInfo,
} from "./VendorBase";

import { addressMatch, venueNameMatched } from "./venueNameMatched";
import { VenueSearchInput } from "./VenueSearchInput";
import { tock_basic_search_and_validate } from "../yumutil/src";

const buildUrl = require("build-url");
const moment = require("moment-timezone");
const getDistance = require("geolib").getDistance;
const tock = require("./tock-trimmed.json");

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
          let datestr = moment
            .tz(date + " " + slot.time, venue.timezone)
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

  async _fetchAppConfigFromURL(url: any): Promise<any> {
    const response = await gotScraping.get({
      url: url,
      headerGeneratorOptions: {
        browsers: [
          {
            name: "chrome",
            minVersion: 87,
            maxVersion: 89,
          },
        ],
        devices: ["desktop"],
        locales: ["de-DE", "en-US"],
        operatingSystems: ["windows", "linux"],
      },
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    var appconfig: any = null;
    const $ = cheerio.load(response.body);
    $("script").map((i: any, el: any) => {
      let text = cheerio(el).html();
      if (text?.includes("window.$REDUX_STATE = ")) {
        const toeval = text.replace("window.$REDUX_STATE", "appconfig");
        // eslint-disable-next-line
        eval(toeval);
      }
      return null;
    });
    return appconfig;
  }

  async fetchReservationInfoFromURL(
    url: string
  ): Promise<VenueReservationInfo | null> {
    const appconfig = await this._fetchAppConfigFromURL(url);
    return {
      reservation: this.vendorID(),
      businessid: appconfig.app.config.business.id,
      // name: appconfig.app.config.business.name,
      // address: appconfig.app.config.business.address,
      urlSlug: appconfig.app.config.business.domainName,
    };
  }

  async entitySearchExactTerm(
    term: string,
    longitude: number,
    latitude: number,
    extra: VenueSearchInput
  ): Promise<VenueReservationInfo | null> {
    const result1 = await tock_basic_search_and_validate(
      term,
      longitude,
      latitude,
      extra.address,
      extra.city,
      extra.state
    );

    return {
      businessid: result1?.businessid?.toString(),
      reservation: this.vendorID(),
      urlSlug: result1?.slug,
    };
  }
}
