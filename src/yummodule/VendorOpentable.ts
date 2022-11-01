import cheerio from 'cheerio';
import { RateLimiter } from 'limiter';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const fetch = require('node-fetch');
const buildUrl = require('build-url');
const moment = require('moment-timezone');
const userCache = new CacheContainer(new MemoryStorage())

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

        let token = await VendorOpentable.fetchAuthToken();
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
                "authorization": `Bearer ${token}`,
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

    @Cache(userCache, { ttl: 60 * 60 })
    static async fetchAuthToken(): Promise<string> {
        // Inspired by https://www.vintnersresort.com/dining/john-ash-co/
        // https://www.opentable.com/restref/client?rid=1477&restref=1477&partysize=2&datetime=2022-10-31T19%3A00&lang=en-US&r3uid=TJkBfg-7J&ot_campaign=JA+Landing+Page&ot_source=Restaurant+website&color=1&modal=true' 
        let url = "https://www.opentable.com/restref/client?rid=1477&restref=1477&partysize=2&datetime=2022-10-31T19%3A00&lang=en-US&r3uid=TJkBfg-7J&ot_campaign=JA+Landing+Page&ot_source=Restaurant+website&color=1&modal=true";
        let data = {
            "rid": "1477",
            "restref": "1477",
            "partysize": "2",
            "datetime": "2023-10-31T19:00:00",
        };
        const w = await fetch(url + new URLSearchParams(data).toString());

        const res = await w.text();
        const $ = cheerio.load(res);

        let scripts = $("#client-initial-state");
        let json = cheerio(scripts).html();
        let config = JSON.parse(json!);
        let token = config["authToken"];
        return token;
    }
}
