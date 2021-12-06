import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

export class VendorTock extends VendorBase {
    vendorID() {
        return "tock";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let url = "https://www.exploretock.com/api/consumer/calendar/full";
        let tock_scope = {
            "businessId": venue.businessid,
            "businessGroupId": venue.businessgroupid
        };

        return await superagent.post(url)
            .set('x-tock-scope', JSON.stringify(tock_scope))
            .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .send({})
            .then((res: any) => {
                let total: any = [];

                if (!res.body.result) {
                    return [];
                }
                let slots = res.body.result.ticketGroup;
                slots.forEach(function (slot: any) {
                    if (slot.date === date && slot.availableTickets > 0 && !slot.isCommunal) {
                        // if (slot.date === date && slot.availableTickets > 0) {
                        if (slot.minPurchaseSize <= party_size && slot.maxPurchaseSize >= party_size) {

                            let datestr =
                                moment.tz(date + " " + slot.time, venue.timezone).format();

                            let ret: any = {
                                time: datestr,
                            }

                            if (slot.ticketTypePrice && slot.ticketTypePrice.length > 0) {
                                ret.priceInCents = slot.ticketTypePrice[0].priceCents;
                            }

                            total.push(ret);
                        }
                    }
                });

                return total;
            });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let baseurl = `https://www.exploretock.com/${venue.url_slug}/search`;

        let reservationUrl = buildUrl(baseurl, {
            queryParams: {
                date: date,
                size: party_size,
                time: (timeOption === "dinner") ? "19:00" : "12:00",
            }
        });
        return reservationUrl;
    }

    async fetchVenueInfoFromURL(url: any) {
        return await superagent.get(url)
            .send({})
            .then((res: any) => {
                const $ = cheerio.load(res.text);
                let meta = JSON.parse($("#json-ld-content").html());
                let scripts = $("script").map(function (i: any, el: any) {
                    let text = cheerio(el).html();
                    if (text.includes("REDUX")) {
                        return text.replace("window.$REDUX_STATE = ", "");
                    }
                    return "";
                }).get().join(' ');
                let appconfig = JSON.parse(scripts);

                let venue: any = {};
                if (!appconfig.calendar.offerings || appconfig.calendar.offerings.experience.length === 0) {
                    console.log("booking disabled for " + meta.name)
                    return null;
                }
                venue.name = meta.name; // 
                venue.businessid = appconfig.app.config.business.id;
                venue.realurl = appconfig.app.config.business.webUrl;
                if (!venue.realurl) { venue.realurl = null; }
                venue.menuurl = appconfig.app.config.business.menuUrl;
                if (!venue.menuurl) { venue.menuurl = null; }
                let url_slug = appconfig.app.config.business.domainName;

                // venue.longitude = meta.location.longitude;  //  errh. no GPS
                // venue.latitude = meta.location.latitude; // errh. no GPS

                venue.city = appconfig.app.config.business.city;
                venue.region = appconfig.app.config.business.state;
                venue.country = appconfig.app.config.business.country;
                venue.address = appconfig.app.config.business.address;
                venue.zip = appconfig.app.config.business.zipCode;

                if (!venue.city) { venue.city = null; }
                if (!venue.region) { venue.region = null; }
                if (!venue.country) { venue.country = null; }
                if (!venue.address) { venue.address = null; }
                if (!venue.zip) { venue.zip = null; }

                venue.cuisine = appconfig.app.config.business.cuisines;
                venue.imageList = appconfig.app.config.business.profileImageUrl;
                venue.coverImage = venue.imageList[0];
                // venue.openhours = meta.openingHours;// 
                venue.phone = meta.telephone; //
                venue.priceline = "tock " + meta.priceRange;// 
                venue.email = meta.email;

                venue.distinction = "YUMYUM";
                venue.guide = "YUMYUM";
                venue.stars = "YUMYUM";
                venue.close = false;
                venue.reservation = "tock";
                venue.withOnlineReservation = true;

                venue.url_slug = url_slug;

                venue.localarea = "TBD";
                return venue;
            }, (err: any) => {
                // eat the error
                console.log("Error for tock: " + err + " " + url);
                return null;
            });
    }
};