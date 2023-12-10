import cheerio from 'cheerio';
import { gotScraping } from 'got-scraping';
import { deserializeTockSearchResponseProtoToMsg, newTockSearchRequest, serializeMsgToProto } from './tockRequestMsg';
import { TimeSlots, VendorBase, VenueReservationInfo, VenueVendorInfo } from './VendorBase';
import { addressMatch, venueNameMatched } from './venueNameMatched';
import { VenueSearchInput } from './VenueSearchInput';

const buildUrl = require('build-url');
const moment = require('moment-timezone');
const getDistance = require("geolib").getDistance;
const tock = require('./tock-trimmed.json');
const UserAgent = require('user-agents');

export class VendorTock extends VendorBase {
    vendorID() {
        return "tock";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        const userAgent = new UserAgent({ deviceCategory: 'mobile' })
        let url = "https://www.exploretock.com/api/consumer/calendar/full";
        let tock_scope = {
            "businessId": venue.businessid,
            "businessGroupId": venue.businessgroupid,
            "site": "EXPLORETOCK"
        };

        const response: any = await gotScraping.post({
            url: url,
            responseType: 'json',
            headerGeneratorOptions: {
                browsers: [
                    {
                        name: 'chrome',
                        minVersion: 100,// 87
                        maxVersion: 120// 89
                    }
                ],
                devices: ['desktop'],
                locales: ['de-DE', 'en-US'],
                operatingSystems: ['windows', 'linux'],
            },
            headers: {
                'x-tock-scope': JSON.stringify(tock_scope),
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': 'application/json',
                // this header may make things worse
                // 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'
                'User-Agent': userAgent.toString(),
            },
            json: {
            }
        });


        let total: any = [];

        if (!response.body.result) {
                    return [];
                }

        let slots = response.body.result.ticketGroup;

                slots.forEach(function (slot: any) {
                    if (slot.date === date && slot.availableTickets > 0) {

                        // Osito's commual is ok...  otherwise skip communal
                        if (venue.name !== "Osito" && slot.isCommunal) {
                            return;
                        }

                        // Omakase is has extra non-dining experience that we don't want
                        if (venue.name === "Omakase" && venue.key === "2VZHquW1dA6Gdv7m868O") {
                            const ticketTypeId = slot.ticketTypePrice[0]?.ticketTypeId;
                            // pickup or delivery experience not dine in experience
                            if (ticketTypeId === 129690 || ticketTypeId === 275864) {
                                return;
                            }
                        }

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
        const response = await gotScraping.get({
            url: url,
            headerGeneratorOptions: {
                browsers: [
                    {
                        name: 'chrome',
                        minVersion: 87,
                        maxVersion: 89
                    }
                ],
                devices: ['desktop'],
                locales: ['de-DE', 'en-US'],
                operatingSystems: ['windows', 'linux'],
            },
            headers: {
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        var appconfig: any = null;
        const $ = cheerio.load(response.body);
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

        const url = "https://www.exploretock.com/api/consumer/suggest/nav";

        const yo: any = await gotScraping.post({
            url: url,
            "headers": {
                "accept": "application/octet-stream",
                "content-type": "application/octet-stream",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "x-tock-stream-format": "proto2",
                "Accept-Encoding": "identity",
            },
            "body": proto,
            "method": "POST",
            responseType: 'buffer',
            headerGeneratorOptions: {
                browsers: [
                    {
                        name: 'chrome',
                        minVersion: 87,
                        maxVersion: 89
                    }
                ],
                devices: ['desktop'],
                locales: ['de-DE', 'en-US'],
                operatingSystems: ['windows', 'linux'],
            },
        });

        const buffer = yo.body;
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