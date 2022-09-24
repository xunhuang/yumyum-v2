import cheerio from 'cheerio';
import { RateLimiter } from 'limiter';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const fetch = require('node-fetch');
const buildUrl = require('build-url');
const moment = require('moment-timezone');

// 15 requests per second so we don't overwhelm opentable's server
const limiter = new RateLimiter({ tokensPerInterval: 15, interval: 1000 }); // 1 request per second;

export class VendorOpentable extends VendorBase {

    vendorID() {
        return "opentable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async venueSearchInternal(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<any> {
        // inspired by https://www.vintnersresort.com/dining/john-ash-co/
        // the authorization token needs to be updated from time to time. 

        let url = "https://www.opentable.com/restref/api/availability?lang=en-US";
        let datetime = (timeOption === "dinner") ? date + "T19:00:00" : date + "T12:00:00";
        let data = {
            "rid": venue.businessid,
            "partySize": party_size,
            "dateTime": datetime,
            "enableFutureAvailability": false
        };
        const w = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdGNmcCI6IjQ0MTM2ZmEzNTViMzY3OGExMTQ2YWQxNmY3ZTg2NDllOTRmYjRmYzIxZmU3N2U4MzEwYzA2MGY2MWNhYWZmOGEiLCJpYXQiOjE2NjQwMzk4MTMsImV4cCI6MTY2NDA1MDYxM30.Kfi_UbwyPsgj-IDewUObsOSItLBLTNDfCqpIHUlDjPU",
            }
        });

        const json = await w.json();
        return json;
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        await limiter.removeTokens(1);
        let resbody = await this.venueSearchInternal(venue, date, party_size, timeOption);
        if (typeof (resbody.availability) == "undefined") {
            return [];
        }
        let slots = resbody.availability[date].timeSlots;
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
        const w = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });
        const res = await w.text();
        const $ = cheerio.load(res);
        let scripts = $("script").map(function (i, el) {
            let text = cheerio(el).html();
            if (text?.includes("window.OTDataLayer = ")) {
                text = text.split("\n")[0];
                let aa = text.replace("window.OTDataLayer = ", "")
                    .replace(/window.OT.*/g, "");
                return aa.replace(";", "");
            }
            return "";
        }).get().join(' ');

        let appconfig = JSON.parse(scripts);
        return {
            reservation: this.vendorID(),
            businessid: appconfig[0].rid,
        }
    }
}
