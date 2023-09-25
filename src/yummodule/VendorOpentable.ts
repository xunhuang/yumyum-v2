import cheerio from 'cheerio';
import { VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';
const nodefetch = require('node-fetch');
const buildUrl = require('build-url');

export class VendorOpentable extends VendorBase {

    vendorID() {
        return "opentable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }
    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
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

    async fetchReservationInfoFromURL(url: string): Promise<VenueReservationInfo | null> {
        const w = await nodefetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });
        const res = await w.text();
        const $ = cheerio.load(res);

        let scripts = $("script").map(function (i, el) {
            let text = cheerio(el).html();
            if (text?.includes("window.__INITIAL_STATE__=")) {
                let texts = text.split("\n");
                return texts.map(function (t) {
                    if (t.includes("window.__INITIAL_STATE__=")) {
                        const a = t.replace("window.__INITIAL_STATE__=", "").replace(/;$/g, "");
                        // console.log(a);
                        return a;
                    }
                    return "";
                }).join("");
            }
            return "";
        }).get().join(' ');

        const clean = scripts.replace(/;$/g, '');
        let appconfig = JSON.parse(clean);
        return {
            reservation: this.vendorID(),
            businessid: appconfig.restaurantProfile.restaurant.restaurantId,
        }
    }
}