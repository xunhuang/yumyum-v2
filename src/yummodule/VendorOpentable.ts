import cheerio from 'cheerio';
import { RateLimiter } from 'limiter';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const fetch = require('node-fetch');
const buildUrl = require('build-url');
const moment = require('moment-timezone');
const userCache = new CacheContainer(new MemoryStorage())

// 5 requests per second so we don't overwhelm opentable's server
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 1000 }); // 1 request per second;

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

    // similar to auth token, but this is  window.__CSRF_TOKEN__='d1f278be-aa32-4df0-990e-aa9e5a51cc71';
    // API for search is auto-complete
    // curl 'https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete' \
    //  -H 'content-type: application/json' \
    //  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' \
    //  -H 'x-csrf-token: d1f278be-aa32-4df0-990e-aa9e5a51cc71' \
    //  --data - raw '{"operationName":"Autocomplete","variables":{"term":"tamarind","latitude":37.7688,"longitude":-122.262,"useNewVersion":true},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3cabca79abcb0db395d3cbebb4d47d41f3ddd69442eba3a57f76b943cceb8cf4"}}}' \
    //  --compressed

    async entitySearchExactTerm(term: string, longitude: number, latitude: number): Promise<any> {
        console.log("before fetch");
        const result = await fetch("https://www.opentable.com/dapi/fe/gql?optype=query&opname=Autocomplete", {
            "headers": {
                "accept": "*/*",
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "ot-page-group": "seo-landing-home",
                "ot-page-type": "home",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": "bb848680-56b2-4af7-9467-f25d50c99cd0",
                "x-query-timeout": "1500",
                "cookie": "otuvid=88F68F7B-97B2-4FBC-807B-106199D71C9D; OT-SessionId=e88775e3-3b22-457f-9200-50e072c10425; ha_userSession=lastModified=2022-05-04T19%3A40%3A53.000Z&origin=prod-sc; _fbp=fb.1.1669188329186.1353042515175724; ak_bmsc=003D15393B7CBB1FE22FDCA5902344C6~000000000000000000000000000000~YAAQo/TVFxS0xI+EAQAAJJ9goxHVlUP+ueehCKjl7iIs2HyRWHaWwca9YbxOJeWJIm22Pl5A8q6ePLmVQytVBgbvit2JV67wEbFe7pV5d7Voa1dYNHwHgZCl5aS80y5K7Sy8H2EU92O+9YdfEK/IOz687iHt63KA/KLR6ydEKrKJX7EkaqNiYw5wouErVOQWe3x4q7n+5j6cn37vQjfT0eatCK+h95gISD1ozZ46D7H7SkadrA/besd04k5zgrTehgUhPuCqXSenhljLmdqyQVIIqT6X20SSETOwN8vfH9WaMF1owh1soOqGv5DccIHQIOhk8E2TqSUV0DKbxCT6rlLzvNw/l7zR9VeklI85oeW3j30RvP85QeR8/+c5NL/ghR21s1ck54A9BgFbhqZPGd9dmdoXtb3e27YuPqF34tVNL39j+0i4dP0I2fgEjlSNf+9e5IK0fUONaa5XyLQqWLmKt3Aeor2SEF2EOv82A4qqs0B5Q7wMP9gq; _gcl_au=1.1.722666647.1669188330; ftc=x=2022-11-23T08%3A40%3A24&c=1&pt1=1&pt2=1; OptanonConsent=isIABGlobal=false&datestamp=Tue+Nov+22+2022+23%3A40%3A24+GMT-0800+(Pacific+Standard+Time)&version=6.20.0&hosts=&consentId=6196d42e-3dfb-4c9b-b03b-d1d0ac5f187b&interactionCount=1&landingPath=https%3A%2F%2Fwww.opentable.com%2F&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0010%3A1; _uetsid=021384d06b0011eda50a9f16eff1d63f; _uetvid=021372e06b0011eda2ef8bb104e71fd5; OT-Session-Update-Date=1669189234; bm_sv=F050635464D4C44240BACC199A679E84~YAAQnvTVF2i1OpuEAQAAym5uoxFRtis4qSOZI7GaUIPHqsh37BH4wAJKVj93uDmo0jSrHY9R5hsI1QvDnrngXUGeQOiwdaEOCfABHsy6vlCYIredTmIBYsCW4e6uhHtt7r3mPF8T6sUM4AyNhwvthMqTUevGC3HFjUM0pcFG9JWPaTpcump3GR9TxAdu8ZOd+SWB6nLeOyzDz/WN/h9VsXDcfyqJrbWRiLw/GVqRoU1o4LodllQNb2yO8vXNIYakSOaWAQ==~1",
                "Referer": "https://www.opentable.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"operationName\":\"Autocomplete\",\"variables\":{\"term\":\"tamarin\",\"latitude\":37.7688,\"longitude\":-122.262,\"useNewVersion\":true},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"3cabca79abcb0db395d3cbebb4d47d41f3ddd69442eba3a57f76b943cceb8cf4\"}}}",
            "method": "POST"
        });
        const json = await result.json();
        console.log(json.data.autocomplete.autocompleteResults);
    }

}
