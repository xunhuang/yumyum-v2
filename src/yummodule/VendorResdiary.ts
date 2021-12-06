import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const superagent = require('superagent');
const moment = require('moment-timezone');
export class VendorResdiary extends VendorBase {
    vendorID() {
        return "resdiary";
    }
    requiedFieldsForReservation() {
        return ["url_slug"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        const url = `https://www.resdiary.com/api/Availability/${venue.url_slug}`;
        return await superagent.post(url)
            .set('content-type', "application/json")
            .send({
                VisitDate: date + "T00:00:00",
                VisitTime: (timeOption === "dinner") ? "19:00:00" : "12:00:00",
                PartySize: party_size,
                ChannelCode: "RESDIARYPORTAL",
            })
            .then((res: any) => {
                let total: any = [];
                if (!res.body || !res.body.TimeSlots) {
                    return [];
                }
                let slots = res.body.TimeSlots;
                slots.forEach(function (slot: any) {
                    let datestr =
                        moment.tz(slot.TimeSlot, venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
                return total;
            });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {};
        let url = `https://www.resdiary.com/Restaurant/${venue.url_slug}/Book/Customer`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                bookingDateTime: date + "T" + moment(slot.time).tz(venue.timezone).format("HH:mm:SS"),
                covers: party_size,
            }
        });
        return reservationUrl;
    }

    /*
    async vendor_entity_search(term, longitude, latitude) {
        const url = "https://www.resdiary.com/api/Restaurant/Search";
        return await superagent.get(url)
            .query({
                lng: longitude,
                lat: latitude,
                searchText: term,
            })
            .then((res) => {
                return res.body.Restaurants.map(item => {
                    return {
                        url_slug: item.MicrositeName.toLowerCase(),
                        name: item.Name,
                    };
                });
            });
    }
 
    async fetchVenueInfoFromSearchItem(item) {
        const url = `https://www.resdiary.com/restaurant/${item.url_slug}`;
        return await this.fetchVenueInfoFromURL(url);
    }
 
    async fetchVenueInfoFromURL(url) {
        return await superagent.get(url)
            .redirects(5)
            .then((res) => {
                let venue = {};
                const $ = cheerio.load(res.text);
                venue.latitude = $('meta[property="og:latitude"]')[0].attribs.content;
                venue.longitude = $('meta[property="og:longitude"]')[0].attribs.content;
                venue.realurl = $('.restaurant-website a')[0].attribs.href;
                return venue;
            })
            .catch(err => {
                console.log("error : " + err);
                return null;
            });
    }
    */

}
