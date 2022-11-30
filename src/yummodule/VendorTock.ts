import cheerio from 'cheerio';

import { deserializeTockSearchResponseProtoToMsg, newTockSearchRequest, serializeMsgToProto } from './tockRequestMsg';
import { uspsLookupStreet } from './uspsLookupStreet';
import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');
const moment = require('moment-timezone');
const superagent = require('superagent');
const getDistance = require("geolib").getDistance;
const tock = require('../../public/data/tock-trimmed.json');

function venueNameMatched(a: string, b: string): boolean {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b;
}

async function addressMatch(street_a: string, street_b: string, city: string, state: string): Promise<boolean> {
    street_a = street_a.toLowerCase();
    street_b = street_b.toLowerCase();
    if (street_a === street_b) {
        return true;
    }

    const usps_street_a = await uspsLookupStreet(street_a, city, state);
    const usps_street_b = await uspsLookupStreet(street_b, city, state);
    return usps_street_a === usps_street_b;
}

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
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
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

    async fetchVenueInfoFromURL2(url: any) {
        return await superagent.get(url)
            .send({})
            .then((res: any) => {
            }, (err: any) => {
                // eat the error
                console.log("Error for tock: " + err + " " + url);
                return null;
            });
    }

    async _fetchAppConfigFromURL(url: any): Promise<any> {
        const w = await fetch(url, {
            method: 'get',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "tock_access=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2ODk5NjE5MzMsImlhdCI6MTY1ODQyNTkzM30.xIC4sZ8Gr0co5is5DH0k2qi82A3JVP4sosynXg4tdKk\"; tock_access_legacy=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2ODk5NjE5MzMsImlhdCI6MTY1ODQyNTkzM30.xIC4sZ8Gr0co5is5DH0k2qi82A3JVP4sosynXg4tdKk\"; __stripe_mid=f83d1c55-78c6-47e5-9864-5cd37fcca2cabb2eff; amp_63a9cb=CeQKSfkRIJYOzKIuGYlfq3...1g8hd1g4u.1g8hd6qb6.0.2.2; _gcl_au=1.1.567772335.1667192142; _fbp=fb.1.1667192143306.2133211097; _ga_9JVND3LQW4=GS1.1.1669102017.13.0.1669102017.0.0.0; _ga=GA1.1.499141721.1658425751; HOMEPAGE_FS=\"true\"; tock_latlng=\"37.7749295,-122.4194155\"; tock_geo=10; __cf_bm=SY8M5vRvjASuPZYAtUTxDUWbEZgT8tpeeL1unuAqY10-1669741466-0-AU1AAT5GtIxlANP56CUdGrHEckCTCqqeSlI0GPdQkcu9Kpgpc6RXGiH3zpwtinqauxvTdL0fwbMgDJZCgrLkPVQ=; tock_exp=WidgetBusinessNeighborhood:0,ExperienceTagFilter:1,AddToCartButtonLinkToCart:0,ShopShippingAdditionalItemsText:0,ShopShippingAdditionalItemsCartText:0,ProductCardPaletteLabelsText:1; JSESSIONID=0pdA8pQbi4nvVe58BQ_bTzaZVk4eMKhTcUv0ktR1; tock_shipping_state=\"IL\"; amp_6fd667=HzhaR_DxAijjYJvkG-t1d_...1gj25hq75.1gj25rb31.g.7t.8d"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            body: null
        });

        var appconfig: any = null;
        const res = await w.text();
        const $ = cheerio.load(res);
        $("script").map((i: any, el: any) => {
            let text = cheerio(el).html();
            if (text?.includes("window.$REDUX_STATE = ")) {
                const toeval = text.replace("window.$REDUX_STATE", "appconfig");
                eval(toeval);
            }
        });
        return appconfig;
    }

    async fetchReservationInfoFromURL(url: string): Promise<VenueReservationInfo | null> {
        const appconfig = await this._fetchAppConfigFromURL(url);
        return {
            reservation: this.vendorID(),
            businessid: appconfig.app.config.business.id,
            // name: appconfig.app.config.business.name,
            // address: appconfig.app.config.business.address,
            urlSlug: appconfig.app.config.business.domainName,
        }
    }

    async entitySearchViaScrapedData(term: string, longitude: number, latitude: number, extra: any): Promise<any> {

        if (longitude == null) {
            return null;
        }

        // sort results by distance
        const sorted = tock.sort((a: any, b: any) => {
            let a_d = getDistance(
                { latitude: a?.latitude || 0, longitude: a?.longitude || 0 },
                { latitude: latitude, longitude: longitude }
            );
            let b_d = getDistance(
                { latitude: b?.latitude || 0, longitude: b?.longitude || 0 },
                { latitude: latitude, longitude: longitude }
            );
            return a_d - b_d;
        });

        const makeResult = (candidate: any) => {
            return {
                name: candidate.name,
                reservation: this.vendorID(),
                businessid: candidate.businessid,
                address: candidate.address,
                urlSlug: candidate.slug,
            };
        }

        for (const best of sorted.slice(0, 10)) {
            // distance in meters
            console.log("testing : " + best.name + " " + best.slug);
            const distance = getDistance(
                { latitude: latitude, longitude: longitude },
                { latitude: best.latitude, longitude: best.longitude }
            );
            // if (distance > 150) {
            //     return null;
            // }

            if (venueNameMatched(term, best.name)) {
                return makeResult(best);
            }
            if (await addressMatch(extra.address, best.address, extra.city, extra.region)) {
                return makeResult(best);
            }
        }
        return null;
    }

    async entitySearchExactTerm(term: string, longitude: number, latitude: number, extra: any): Promise<any> {
        const tocksystem = await this.entitySearchViaTockSearchSystem(term, longitude, latitude, extra);
        if (tocksystem != null) {
            return tocksystem;
        }
        return await this.entitySearchViaScrapedData(term, longitude, latitude, extra);
    }

    async entitySearchViaTockSearchSystem(term: string, longitude: number, latitude: number, extra: any): Promise<any> {
        // const request = newTockSearchRequest("French Laundary", -122.4194155, 37.7749295);
        const request = newTockSearchRequest(term, longitude, latitude);
        const proto = serializeMsgToProto(request);

        const yo = await fetch("https://www.exploretock.com/api/consumer/suggest/nav", {
            "headers": {
                "accept": "application/octet-stream",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "content-type": "application/octet-stream",
                "dpr": "1",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "traceparent": "00-400e11eb8419a806155f36a25597cf4f-a17fbac6ab977cba-01",
                "viewport-width": "1334",
                "x-tock-authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2OTU0MDYzMTUsImlhdCI6MTY2Mzg3MDMxNX0.uPsjE4DWHj7zyQyvFP7fXCdV3nyzDxHYlzQq18OtkIA",
                "x-tock-build-number": "601230",
                "x-tock-experimentvariantlist": "WidgetBusinessNeighborhood:0,ExperienceTagFilter:1,AddToCartButtonLinkToCart:1,ShopShippingAdditionalItemsText:0,ShopShippingAdditionalItemsCartText:1,ProductCardPaletteLabelsText:0",
                "x-tock-fingerprint": "f258321c9354e0143b65c2d4c519b455",
                "x-tock-path": "/city/san-francisco",
                "x-tock-scope": "{\"site\":\"EXPLORETOCK\"}",
                "x-tock-session": "client_WhnD25irJMRW46cnipy5ATxW3hSDEENATiAiy6gF",
                "x-tock-shipping-state": "CA",
                "x-tock-stream-format": "proto2",
                "cookie": "_gcl_au=1.1.84428837.1663010872; _fbp=fb.1.1663010872979.1367840335; tock_access=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2OTU0MDYzMTUsImlhdCI6MTY2Mzg3MDMxNX0.uPsjE4DWHj7zyQyvFP7fXCdV3nyzDxHYlzQq18OtkIA\"; __stripe_mid=11e2e112-d24a-4114-9731-c38e93fbb80e079015; tock_geo=10; __cf_bm=ll1c9hfIGaeQ_akUuSFmb5YfW9ytnzjtZP3zsSekEHw-1669681555-0-Ab1LNrhsQIv+i/ngmUOMMWWx707qiZ6A8GYUC775VjsvdJvfuX5Gebb0RfCBzE7qLTL9gJ4HLJg6/OBc0xd1/J4=; notice_behavior=implied,us; tock_exp=WidgetBusinessNeighborhood:0,ExperienceTagFilter:1,AddToCartButtonLinkToCart:1,ShopShippingAdditionalItemsText:0,ShopShippingAdditionalItemsCartText:1,ProductCardPaletteLabelsText:0; tock_shipping_state=\"CA\"; JSESSIONID=loPN9-0mhPNcU0_xbGmvkqCdAQpsrJzIMNWLLOBm; _gid=GA1.2.2126522280.1669681557; _ga_9JVND3LQW4=GS1.1.1669681557.3.0.1669681557.0.0.0; _ga=GA1.1.1027086921.1663010873; _gat=1; amp_6fd667=csTpuy3ZAAyiOyzHA-lqk3...1gj0cdb4r.1gj0cdc4b.0.5.5",
                "Referer": "https://www.exploretock.com/city/san-francisco",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": proto,
            "method": "POST"
        });

        const buffer = await yo.arrayBuffer();
        const response = deserializeTockSearchResponseProtoToMsg(new Uint8Array(buffer));


        const searchResults = response?.r1!.r2!.r3!.searchResults;
        if (!searchResults) {
            return null;
        }

        const makeResult = (candidate: any) => {
            return {
                name: candidate.name,
                reservation: this.vendorID(),
                businessid: candidate.businessid,
                address: candidate.address,
                urlSlug: candidate.domainName,
            };
        }

        for (const entry of searchResults) {
            const slug = entry.slug;

            if (!slug) {
                continue;
            }

            const appconfig = await this._fetchAppConfigFromURL(`https://www.exploretock.com/${slug}`);

            const business = appconfig.app.config.business;
            const name = business.name;
            const address = business.address;

            if (venueNameMatched(term, name)) {
                return makeResult(business);
            }
            if (await addressMatch(extra.address, address, extra.city, extra.region)) {
                return makeResult(business);
            }
        }
        return null;

    }
};