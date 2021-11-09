import { TimeSlots, VenueVendorInfo } from './VendorBase';


const fetch = require('node-fetch');

const { VendorBase } = require("./VendorBase");
const buildUrl = require('build-url');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

class VendorOpentable extends VendorBase {

    vendorID() {
        return "opentable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async venueSearchInternal(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<any> {
        let url = "https://www.opentable.com/restaurant/profile/" + venue.businessid + "/search";
        let datetime = (timeOption === "dinner") ? date + "T19:00:00" : date + "T12:00:00";
        let data = {
            "covers": party_size,
            "dateTime": datetime,
            "isRedesign": true
        };

        // console.log(url);
        // console.log(data);

        const w = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        const json = await w.json();
        return json;
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        let resbody = await this.venueSearchInternal(venue, date, party_size, timeOption);

        // should take advantange of this.
        // console.log(resbody?.multiDaysAvailability?.timeslots);

        if (typeof (resbody.availability) == "undefined") {
            return [];
        }
        let slots = resbody.availability.times;
        let total: TimeSlots[] = [];
        slots.forEach(function (slot: any) {
            let datestr =
                moment.tz(slot.dateTime.substr(0, 19), venue.timezone).format();
            total.push({
                time: datestr,
            });
        });
        return total;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let url = `https://www.opentable.com/restaurant/profile/${venue.businessid}/reserve`;
        let datestr = (timeOption === "dinner") ? date + "T19:00" : date + "T12:00";
        let reservationUrl = buildUrl(url, {
            queryParams: {
                rid: venue.businessid,
                restref: venue.businessid,
                datetime: datestr,
                covers: party_size,
            }
        });
        return reservationUrl;
    }
    /*
    
        async fetchVenueInfoFromURL(url) {
        return await superagent.get(url)
            .redirects(5)
            .then((res) => {
                let venue = {};
                const $ = cheerio.load(res.text);
                let scripts = $("script").map(function (i, el) {
                    let text = cheerio(el).html();
                    if (text.includes("window.OTDataLayer = ")) {
                        let aa = text.replace("window.OTDataLayer = ", "").
                            replace(';', "");
                        return aa.replace(";", "");
                    }
                    return "";
                }).get().join(' ');
    
                let appconfig = JSON.parse(scripts);
                venue.businessid = appconfig[0].rid;
    
                let meta = JSON.parse(cheerio($(".schema-json")[0]).html());
                venue.name = meta.name;
                venue.realurl = meta.url;
                venue.longitude = meta.geo.longitude;
                venue.latitude = meta.geo.latitude;
                venue.city = meta.address.addressLocality;
                venue.region = meta.address.addressRegion;
                venue.country = meta.address.addressCountry;
                venue.address = meta.address.streetAddress;
                venue.zip = meta.address.postalCode;
    
                venue.cuisine = meta.servesCuisine;
                venue.imageList = meta.image;
                if (meta.image) {
                    venue.coverImage = meta.image[0];
                    if (!venue.coverImage) {
                        venue.coverImage = null;
                    }
                }
                venue.openhours = meta.openingHours;
                venue.phone = meta.telephone;
                venue.priceline = meta.priceRange;
    
                venue.distinction = "YUMYUM";
                venue.guide = "YUMYUM";
                venue.stars = "YUMYUM";
                venue.close = false;
                venue.reservation = "opentable";
                venue.withOnlineReservation = true;
    
                venue.localarea = "TBD";
                return venue;
            })
            .catch(err => {
                console.log("error : " + err);
                return null;
            });
    }
    
        async vendor_entity_search(term, longitude, latitude) {
        let url = "https://www.opentable.com/personalizer-autocomplete/v3/onebox/";
        return await
            superagent.get(url)
                .query({
                    term: term,
                    longitude: longitude,
                    latitude: latitude,
                })
                .then((res) => {
                    return res.body.results.map(item => {
                        let result = {
                            businessid: item.id,
                            name: item.name,
                        }
                        if (item.latitude) {
                            result.latitude = item.latitude;
                        }
                        if (item.longitude) {
                            item.longitude = item.longitude;
                        }
                        if (item.region) {
                            item.city = item.region.name;
                        }
                        return result;
                    })
                })
    }
    
        async fetchVenueInfoFromSearchItem(item) {
        let url = `https://www.opentable.com/restaurant/profile/${item.businessid}`;
        return await this.fetchVenueInfoFromURL(url);
    }
    */
}

exports.VendorOpentable = VendorOpentable;