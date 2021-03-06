import { RateLimiter } from 'limiter';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const superagent = require('superagent');
const moment = require('moment-timezone');
const urlparse = require('url');

const limiter = new RateLimiter({ tokensPerInterval: 15, interval: 1000 }); // 1 request per second;

/* Resy API:

Look up venue information given venue id. Useful for getting the venue id from Michelin Website
then finding Resy City code and url slug.

curl 'https://api.resy.com/3/venue?id=5785' \
  -H 'authorization: ResyAPI api_key="PXnGpHdkz0Y38qg3QdMkRw2GkgBcMEXL"'
*/

/*
async function entitySearchExactTerm(term, longitude, latitude) {
    const url = "https://api.resy.com/3/venuesearch/search";
    return await superagent.post(url)
        .set('Authorization', 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
        .send({
            geo: {
                longitude: longitude,
                latitude: latitude,
            },
            query: term,
            types: ["venue", "cuisine"],
        })
        .then((res) => {
            let myresult = JSON.parse(res.text);
            let hits = myresult.search.hits;
            return hits;
        }, err => {
            console.log(err);
            return [];
        });
}
*/

export class VendorResy extends VendorBase {

    vendorID() {
        return "resy";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "resy_city_code"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        await limiter.removeTokens(1);
        const url = "https://api.resy.com/4/find";

        return await superagent.get(url)
            .query({
                day: date,
                lat: 0,
                long: 0,
                party_size: party_size,
                venue_id: venue.businessid,
            })
            .set('Authorization', 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .send({})
            .then((res: any) => {
                let total: TimeSlots[] = [];
                if (!res.body.results.venues) {
                    return [];
                }
                if (!res.body.results.venues[0]) {
                    return [];
                }
                let slots = res.body.results.venues[0].slots;
                slots.forEach(function (slot: any) {
                    let datestr =
                        moment.tz(slot.date.start, venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
                return total;
            });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let baseurl = `https://resy.com/cities/${venue.resy_city_code}/${venue.url_slug}`;

        let reservationUrl = buildUrl(baseurl, {
            queryParams: {
                date: date,
                seats: party_size,
            }
        });
        return reservationUrl;
    }

    /*
    async fetchVenueInfoFromURL(url) {
        var url_parts = urlparse.parse(url, true);
        var paths = url_parts.pathname.split("/");
        let citycode = paths[2];
        let url_slug = paths[3];

        const venueurl = "https://api.resy.com/3/venue";

        return await superagent.get(venueurl)
            .query({
                location: citycode,
                url_slug: url_slug,
            })
            .set('Authorization', 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
            .send({})
            .then((res) => {
                let meta = res.body;
                let venue = {};
                venue.businessid = meta.id.resy;
                venue.name = meta.name;
                venue.realurl = meta.contact.url;

                venue.longitude = meta.location.longitude;
                venue.latitude = meta.location.latitude;
                venue.city = meta.location.locality;
                venue.region = meta.location.region;
                venue.country = meta.location.country;
                venue.address = meta.location.address_1;
                venue.zip = meta.location.postal_code;

                venue.cuisine = meta.type;
                venue.imageList = meta.images;
                venue.coverImage = meta.images[0];
                // venue.openhours = meta.openingHours;// 
                venue.phone = meta.contact.phone_number;
                venue.priceline = "resy " + meta.price_range_id;

                venue.distinction = "YUMYUM";
                venue.guide = "YUMYUM";
                venue.stars = "YUMYUM";
                venue.close = false;
                venue.reservation = "resy";
                venue.withOnlineReservation = true;

                venue.url_slug = url_slug;
                venue.resy_city_code = citycode;

                venue.localarea = "TBD";
                return venue;
            }, err => {
                // eat the error
                console.log("Error for resy: " + err + " " + venueurl);
                return null;
            });
    }

    async entitySearchForMany(term, longitude, latitude) {
        let hits = await entitySearchExactTerm(term, longitude, latitude);
        if (hits.length === 0) {
            let fuzzyterm = term.replace(/\W/g, ' ');  // remove non-alpha numeric strings.  not sure if it's a good thing for european countries
            hits = await entitySearchExactTerm(fuzzyterm, longitude, latitude);
        }

        let results = hits.map(hit => {
            const citycode = hit.location.code;
            const url_slug = hit.url_slug;
            return {
                name: hit.name,
                url_slug: url_slug,
                resy_city_code: citycode,
                businessid: hit.objectID,
                reservation: "resy",
                city: hit.location.name,
                url: `https://resy.com/cities/${citycode}/${url_slug}`,
            }
        });

        return results;
    }

    async vendor_entity_search(term, longitude, latitude) {

        const url = "https://api.resy.com/3/venuesearch/search";
        return await superagent.post(url)
            .set('Authorization', 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
            .send({
                geo: {
                    longitude: longitude,
                    latitude: latitude,
                },
                query: term,
                types: ["venue", "cuisine"],
            })
            .then((res) => {
                let myresult = JSON.parse(res.text);
                let hits = myresult.search.hits;
                return hits.map(hit => {
                    const citycode = hit.location.code;
                    const url_slug = hit.url_slug;
                    return {
                        name: hit.name,
                        url_slug: url_slug,
                        resy_city_code: citycode,
                        businessid: hit.objectID,
                        reservation: "resy",
                        city: hit.location.name,
                        latitude: hit._geoloc.lat,
                        longitude: hit._geoloc.lng,
                        url: `https://resy.com/cities/${citycode}/${url_slug}`,
                    }

                });
            }, err => {
                console.log(err);
                return [];
            });
    }
    */
    async fetchReservationInfoFromURL(url: string): Promise<VenueReservationInfo | null> {
        var url_parts = urlparse.parse(url, true);
        var paths = url_parts.pathname.split("/");
        let citycode = paths[2];
        let url_slug = paths[3];

        const venueurl = "https://api.resy.com/3/venue";

        const data = await superagent.get(venueurl)
            .query({
                location: citycode,
                url_slug: url_slug,
            })
            .set('Authorization', 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"')
            .send({})
            .then((res: any) => {
                return res.body;
            });
        return {
            reservation: this.vendorID(),
            businessid: data.id.resy,
            urlSlug: url_slug,
            resyCityCode: citycode,

        }
    }
}
