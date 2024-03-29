import cheerio from 'cheerio';
import { deserializeTockSearchResponseProtoToMsg, newTockSearchRequest, serializeMsgToProto } from './tockRequestMsg';
import { VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';
import { addressMatch, venueNameMatched } from './venueNameMatched';
import { VenueSearchInput } from './VenueSearchInput';

const buildUrl = require('build-url');
const getDistance = require("geolib").getDistance;
const tock = require('./tock-trimmed.json');

export class VendorTock extends VendorBase {
    vendorID() {
        return "tock";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
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
                // eslint-disable-next-line
                eval(toeval);
            }
            return null;
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

    async entitySearchViaScrapedData(term: string, longitude: number, latitude: number, extra: VenueSearchInput): Promise<any> {

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
                businessid: candidate.businessid.toString(),
                address: candidate.address,
                urlSlug: candidate.slug,
            };
        }

        for (const best of sorted.slice(0, 10)) {
            // console.log(JSON.stringify(best, null, 2));
            // distance in meters
            if (best.latitude != null && best.longitude != null) {
                const distance = getDistance(
                    { latitude: latitude, longitude: longitude },
                    { latitude: best.latitude, longitude: best.longitude }
                );
                if (distance > 150) {
                    return null;
                }
            }

            if (venueNameMatched(term, best.name)) {
                return makeResult(best);
            }
            if (await addressMatch(extra.address, best.address, extra.city, extra.state)) {
                return makeResult(best);
            }
        }
        return null;
    }

    async entitySearchExactTerm(term: string, longitude: number, latitude: number, extra: VenueSearchInput): Promise<VenueReservationInfo | null> {
        const tocksystem = await this.entitySearchViaTockSearchSystem(term, longitude, latitude, extra);
        if (tocksystem != null) {
            return tocksystem;
        }
        return await this.entitySearchViaScrapedData(term, longitude, latitude, extra);
    }

    async entitySearchViaTockSearchSystem(term: string, longitude: number, latitude: number, extra: any): Promise<any> {
        const request = newTockSearchRequest(term, longitude, latitude);
        const proto = serializeMsgToProto(request);

        const yo = await fetch("https://www.exploretock.com/api/consumer/suggest/nav", {
            "headers": {
                "accept": "application/octet-stream",
                "content-type": "application/octet-stream",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "x-tock-stream-format": "proto2",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
                "Accept-Encoding": "identity",
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
                businessid: candidate.id.toString(),
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
            if (!appconfig) {
                console.log(`can't read appconfig from tock for ${slug} `)
                continue;
            }

            const business = appconfig.app.config.business;
            const name = business.name;
            const address = business.address;
            const city = business.city;
            const state = business.state;

            if (venueNameMatched(term, name)) {
                // console.log("name matched ----------------------------, term: ", term, "name: ", name);
                return makeResult(business);
            }
            const country = business.country;
            if (country === "US") {
                if (await addressMatch(extra.address, address, city, state)) {
                    // console.log("address matched ----------------------------, address: ", address, "extra.address: ", extra.address);
                    return makeResult(business);
                }
            }
        }
        return null;

    }
};