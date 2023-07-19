import cheerio from 'cheerio';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const superagent = require('superagent');
const moment = require('moment-timezone');
const urlparse = require('url');

// async function entitySearchExactTerm(term, longitude, latitude) {
//     const url = "https://www.yelp.com/search_suggest/v2/prefetch";
//     return await superagent.get(url)
//         .query({
//             // lat: 37.4841344,
//             // lng: -122.14108159999999,
//             lat: latitude,
//             lng: longitude,
//             is_new_loc: "",
//             prefix: term,
//             is_initial_prefetch: "",
//         })
//         .then((res) => {
//             let myresult = JSON.parse(res.text);
//             let hits = myresult.response[0].suggestions;
//             if (!hits) {
//                 return [];
//             }
//             return hits;
//         });
// }

export class VendorYelp extends VendorBase {
    vendorID() {
        return "yelp";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "longitude", "latitude"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let url = `https://www.yelp.com/reservations/${venue.url_slug}/search_availability`;

        let datetime = (timeOption === "dinner") ? "19:00:00" : "12:00:00";

        let data = {
            append_request: "false",
            biz_id: venue.businessid,
            biz_lat: venue.latitude,
            biz_long: venue.longitude,
            covers: party_size,
            date: date,
            days_after: 0,
            days_before: 0,
            num_results_after: 3,
            num_results_before: 3,
            search_type: "URL_INITIATE_SEARCH",
            time: datetime,
            weekly_search_enabled: "true",
        };

        return await superagent.get(url)
            .set('x-requested-with', "XMLHttpRequest")
            .query(data)
            .then((res: any) => {
                let total: any = [];
                if (res.body.availability_data.length === 0) {
                    return [];
                }
                let list = res.body.availability_data[0].availability_list;

                if (list.length === 0) {
                    return [];
                }
                let slots = list;
                slots.forEach(function (slot: any) {
                    let datestr =
                        moment.tz(slot.isodate, venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
                return total;
            });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://www.yelp.com/reservations/${venue.url_slug}`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                date: date,
                covers: party_size,
                from_reserve_now: 1,
                time: (timeOption === "dinner") ? 1900 : 1200,
            }
        });
        return reservationUrl;
    }

    async fetchReservationInfoFromURL(url: string): Promise<VenueReservationInfo | null> {
        const res = await superagent.get(url);

        var url_parts = urlparse.parse(url, true);
        var path_parts = url_parts.pathname.split("/");
        const url_slug = path_parts[path_parts.length - 1];

        const $ = cheerio.load(res.text);
        let scriptText = $("script").map(function (i, el) {
            let text = cheerio(el).html();
            if (text?.includes('window.yr_search_widget_data')) {
                text = text?.replace(/\n/g, '')!;
                return text.replace(/.*window.yr_landing_data = "/, "")
                    .replace(/";/g, "")
                    .replace(/\\"/g, '"');
            }
            return "";
        }).get().join(' ');
        scriptText = scriptText.trim();
        const config = JSON.parse(scriptText);
        return {
            reservation: this.vendorID(),
            businessid: config.businessId,
            urlSlug: url_slug,
            latitude: config.mapData.latitude,
            longitude: config.mapData.longitude
        }

    }

}