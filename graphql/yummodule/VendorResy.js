const { VendorBase } = require("./VendorBase");
const buildUrl = require('build-url');
const superagent = require('superagent');
const urlparse = require('url');
const moment = require('moment-timezone');

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

class VendorResy extends VendorBase {

    vendorID() {
        return "resy";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "resy_city_code"];
    }

    async venueSearch(venue, date, party_size, timeOption) {
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
            .send({})
            .then((res) => {
                let total = [];
                if (!res.body.results.venues) {
                    return [];
                }
                if (!res.body.results.venues[0]) {
                    return [];
                }
                let slots = res.body.results.venues[0].slots;
                slots.forEach(function (slot) {
                    let datestr =
                        moment.tz(slot.date.start, venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
                return total;
            });
    }

    getReservationUrl(venue, datestr, parties, timeOption) {
        let baseurl = `https://resy.com/cities/${venue.resy_city_code}/${venue.url_slug}`;

        let reservationUrl = buildUrl(baseurl, {
            queryParams: {
                date: datestr,
                seats: parties
            }
        });
        return reservationUrl;
    }

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
}

exports.VendorResy = VendorResy;