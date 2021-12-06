import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const superagent = require('superagent');
const moment = require('moment-timezone');

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
        return ["businessid", "url_slug"];
    }

    // async fetchVenueInfoFromURL(redirect_url) {
    //     const url = redirect_url;
    //     return await superagent.get(url)
    //         .then((res) => {
    //             const $ = cheerio.load(res.text);
    //             let fullurl = $('link[rel="canonical"]').attr("href");
    //             if (!fullurl.startsWith("http://www.yelp.com/reservations")) {
    //                 console.log("full url not match " + fullurl);
    //                 return null;
    //             }

    //             let scriptText = $("script").map(function (i, el) {
    //                 let text = cheerio(el).html();
    //                 if (text.includes('window.yr_search_widget_data')) {
    //                     return text;
    //                 }
    //                 return "";
    //             }).get().join(' ');

    //             // eslint-disable-next-line no-unused-vars
    //             scriptText = scriptText.trim();

    //             let window = {};
    //             if (true)
    //                 throw new Error("fix me, we do need the eval here");

    //             // eval(scriptText);
    //             let schema = JSON.parse(window.yr_landing_data);
    //             var url_parts = urlparse.parse(redirect_url, true);
    //             let paths = url_parts.pathname.split("/");

    //             return {
    //                 reservation: "yelp",
    //                 businessid: schema.businessId,
    //                 url_slug: paths[paths.length - 1],
    //                 withOnlineReservation: true,
    //                 latitude: schema.mapData.latitude,
    //                 longitude: schema.mapData.longitude
    //             }

    //         }, err => {
    //             console.log(err);
    //             return null;
    //         });
    // }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let url = `https://www.yelp.com/reservations/${venue.url_slug}/search_availability`;
        let datetime = (timeOption === "dinner") ? "19:00:00" : "12:00:00";
        let data = {
            biz_id: venue.businessid,
            covers: party_size,
            date: date,
            time: datetime,
            days_after: 0,
            days_before: 0,
            num_results_after: 3,
            num_results_before: 3,
            search_type: "INITIAL_SEARCH",
            weekly_search_enabled: "true",
            biz_long: venue.longitude,
            biz_lat: venue.latitude,
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

    // async entitySearch(venue, longitude, latitude) {
    //     let term = venue.name;
    //     let hits = await entitySearchExactTerm(term, longitude, latitude);
    //     if (hits.length === 0) {
    //         let fuzzyterm = term.replace(/\W/g, ' ');  // remove non-alpha numeric strings.  not sure if it's a good thing for european countries
    //         hits = await entitySearchExactTerm(fuzzyterm, longitude, latitude);
    //     }

    //     for (let i = 0; i < 1 && i < hits.length; i++) {
    //         let hit = hits[i];
    //         if (hit.query === term) {
    //             let paths = hit.redirect_url.split("/");
    //             let schema = await this.fetchVenueInfoFromURL("https://www.yelp.com/reservations/" + paths[2]);
    //             if (!schema) {
    //                 continue;
    //             }
    //             let d = getDistance(
    //                 { latitude: latitude, longitude: longitude },
    //                 { latitude: schema.latitude, longitude: schema.longitude }
    //             );
    //             if (d < 300) {
    //                 return schema;
    //             }
    //         }
    //     }
    //     return null;
    // }

    // async entitySearchForMany(term, longitude, latitude) {
    //     let hits = await entitySearchExactTerm(term, longitude, latitude);
    //     hits = hits.filter(hit => hit.redirect_url);
    //     let results = hits.map(hit => {

    //         let parts = hit.redirect_url.split("/");
    //         let url_slug = parts[parts.length - 1];
    //         return {
    //             name: hit.title,
    //             city: hit.subtitle,
    //             url: `https://www.yelp.com/reservations/${url_slug}`,
    //             reservation: "yelp"
    //         }
    //     });

    //     return results;
    // }
}