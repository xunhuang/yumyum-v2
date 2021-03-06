import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');
const buildUrl = require('build-url');

export class VendorLafourchette extends VendorBase {

    vendorID() {
        return "lafourchette";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        const url = `https://module.lafourchette.com/fr_FR/resa/pick-time/${party_size}/${date}/${venue.url_slug}/${venue.businessid}`;
        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .then((res: any) => {
                return res.body.availableTimeslotList;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        let answers = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total: any = [];
        Object.values(answers).map((group: any) => {
            let slots = group.timeslots;
            for (var key in slots) {
                let dstr = date + " " + slots[key].time + ":00";
                console.log(dstr);
                total.push(moment.tz(dstr, venue.timezone).format());
            }
            return null;
        });

        const dedup = [...new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });

        return dedup as TimeSlots[];
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://module.lafourchette.com/fr_FR/module/${venue.url_slug}#/${venue.businessid}/pdh`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                pax: party_size,
                date: date,
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return "https://module.lafourchette.com/fr_FR/module/468615-17bc3";
    }

    // async vendor_entity_search(term, longitude, latitude) {
    //     const url = "https://www.lafourchette.com/recherche/autocomplete";

    //     return await superagent.get(url)
    //         .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
    //         .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
    //         .set('Accept', '*/*')
    //         .query({
    //             searchText: term,
    //             localeCode: "fr",
    //         })
    //         .then((res: any) => {

    //             let item = res.body.data.restaurants[0];
    //             if (item) {
    //                 return [{
    //                     businessid: item.id_restaurant,
    //                     name: item.name.text,
    //                 }];
    //             }
    //             return [];
    //         })
    //         .catch((err: any) => {
    //             console.log(err);
    //             return [];
    //         });
    //     ;
    // }

    // async fetchVenueInfoFromSearchItem(item) {
    //     const url = `https://www.lafourchette.com/recherche/?idRestaurant=${item.businessid}`;
    //     return await this.fetchVenueInfoFromURL(url);
    // }

    // async fetchVenueInfoFromURL(url) {
    //     return await superagent.get(url)
    //         .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
    //         .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
    //         .set('Accept', '*/*')
    //         .redirects(5)
    //         .then((res) => {
    //             let venue = {};
    //             const $ = cheerio.load(res.text);
    //             venue.latitude = $('meta[property="place:location:latitude"]')[0].attribs.content;
    //             venue.longitude = $('meta[property="place:location:longitude"]')[0].attribs.content;
    //             venue.realurl = $('meta[property="og:url"]')[0].attribs.content;
    //             venue.url_slug = YumUtil.urlPathParts(venue.realurl, 2);
    //             // console.log(venue);
    //             return venue;
    //         })
    //         .catch(err => {
    //             console.log("error : " + err);
    //             return null;
    //         });
    // }


}
