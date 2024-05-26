import { RateLimiter } from "limiter";

import {
  TimeSlots,
  VendorBase,
  VenueReservationInfo,
  VenueVendorInfo,
} from "./VendorBase";
import { addressMatch, venueNameMatched } from "./venueNameMatched";
import { VenueSearchInput } from "./VenueSearchInput";

const buildUrl = require("build-url");
const superagent = require("superagent");
const urlparse = require("url");
const getDistance = require("geolib").getDistance;

const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 }); // 1 request per second;

/* Resy API:

Look up venue information given venue id. Useful for getting the venue id from Michelin Website
then finding Resy City code and url slug.

curl 'https://api.resy.com/3/venue?id=5785' \
  -H 'authorization: ResyAPI api_key="PXnGpHdkz0Y38qg3QdMkRw2GkgBcMEXL"'
*/

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

  async fetchReservationInfoFromURL(
    url: string
  ): Promise<VenueReservationInfo | null> {
    var url_parts = urlparse.parse(url, true);
    var paths = url_parts.pathname.split("/");
    let citycode = paths[2];
    let url_slug = paths[3];

    const venueurl = "https://api.resy.com/3/venue";

    console.log(citycode, url_slug);

    const data = await superagent
      .get(venueurl)
      .query({
        url_slug: url_slug,
        location: citycode,
      })
      .set(
        "Authorization",
        'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"'
      )
      .set(
        "User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
      )
      .then((res: any) => {
        return res.body;
      });
    return {
      reservation: this.vendorID(),
      businessid: data.id.resy,
      urlSlug: url_slug,
      resyCityCode: citycode,
    };
  }

  async _APIVenueLookup(slug: string, location: string): Promise<any> {
    const venueurl = "https://api.resy.com/3/venue";
    const data = await superagent
      .get(venueurl)
      .set(
        "Authorization",
        'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"'
      )
      .query({
        url_slug: slug,
        location: location,
      })
      .then((res: any) => {
        return JSON.parse(res.text);
      });
    return data?.location;
  }

  async entitySearchExactTerm(
    term: string,
    longitude: number,
    latitude: number,
    extra: VenueSearchInput
  ): Promise<VenueReservationInfo | null> {
    if (!longitude || !latitude) {
      console.log(`Resy search API requires long/lat, none provided ${term}`);
      return null;
    }

    const url = "https://api.resy.com/3/venuesearch/search";
    const candidates = await superagent
      .post(url)
      .set(
        "Authorization",
        'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"'
      )
      .send({
        geo: {
          longitude: longitude,
          latitude: latitude,
        },
        query: term,
        types: ["venue", "cuisine"],
      })
      .then(
        (res: any) => {
          let myresult = JSON.parse(res.text);
          let hits = myresult.search.hits;
          return hits;
        },
        (err: any) => {
          console.log(err);
          return [];
        }
      );

    if (candidates.length === 0) {
      return null;
    }

    const makeResult = (best: any) => {
      const result = {
        name: best.name,
        reservation: this.vendorID(),
        businessid: `${best.id.resy}`,
        urlSlug: best.url_slug,
        resyCityCode: best.location.code,
      };
      return result;
    };

    for (const entry of candidates.slice(0, 10)) {
      // distance in meters
      const distance = getDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: entry._geoloc.lat, longitude: entry._geoloc.lng }
      );

      if (distance > 5000) {
        continue;
      }

      if (venueNameMatched(term, entry.name)) {
        return makeResult(entry);
      }

      const location = await this._APIVenueLookup(
        entry.url_slug,
        entry.location.id
      );

      if (
        location &&
        (await addressMatch(
          location.address_1,
          extra.address,
          extra.city,
          extra.state
        ))
      ) {
        // console.log("address matched", location.address_1, "-", extra.address);
        return makeResult(entry);
      }
    }
    return null;
  }
}
