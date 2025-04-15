import cheerio from 'cheerio';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';
import { yelp_find_reservation } from '../yumutil/src/yelp_support';
import dayjs from 'dayjs';

const buildUrl = require('build-url');
const superagent = require('superagent');
const urlparse = require('url');

export class VendorYelp extends VendorBase {
    vendorID() {
        return "yelp";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "longitude", "latitude"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        if (!venue.url_slug || !venue.businessid || !venue.longitude || !venue.latitude) {
            console.log("missing required fields for yelp venue", venue);
            return [];
        }

        const results = await yelp_find_reservation(venue.url_slug, venue.businessid, Number(venue.longitude), Number(venue.latitude), date, party_size, timeOption);

        let total: any = [];

        console.log("results", results);

        if (results.availability_data.length === 0) {
                    return [];
                }
        let list = results.availability_data[0].availability_list;

        if (list.length === 0) {
            return [];
        }
        let slots = list;
                slots.forEach(function (slot: any) {
                    let datestr = dayjs(slot.isodate).tz(venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
        return total;
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