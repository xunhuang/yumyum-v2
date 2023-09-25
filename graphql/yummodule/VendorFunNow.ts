import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');
const cheerio = require('cheerio');
const urlparse = require('url');

export class VendorFunNow extends VendorBase {
    vendorID() {
        return "funnow";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getProducts(venue: VenueVendorInfo) {
        // const url = `https://michelin.myfunnow.com/en/branches/${venue.businessid}`;
        const url = `https://www.myfunnow.com/en/branches/${venue.businessid}`;

        return await superagent.get(url)
            .then((res: any) => {
                const $ = cheerio.load(res.text);
                let schemaText = $("script").map(function (i: any, el: any) {
                    let text = cheerio(el).html();
                    if (text.includes('"@type":"ItemList"')) {
                        return text;
                    }
                    return "";
                }).get().join(' ')

                let json = JSON.parse(schemaText);

                let products = json.itemListElement.map((item: any) => {
                    var url_parts = urlparse.parse(item.url, true);
                    var path_parts = url_parts.path.split("/");


                    let last = path_parts[path_parts.length - 1];

                    return last;
                });

                return products;
            });
    }

    async getSlotsForProducts(venue: VenueVendorInfo, product_id: string, date: string, party_size: number): Promise<TimeSlots[]> {

        const url = `https://api-go.myfunnow.com/v2/funnow/pub/product/${product_id}/arrivaltimes`;
        const queryparam = {
            count: party_size,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res: any) => {
                let slots = res.body.data.data;
                if (!slots) {
                    return null;
                }
                slots = slots.filter((s: any) => {
                    return moment.tz(s.promostart, venue.timezone).format("YYYY-MM-DD") === date;
                });

                return slots.map((s: any) => {
                    return {
                        time: moment.tz(s.promostart, venue.timezone).format(),
                        product: product_id,
                    }
                })
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        let products = await this.getProducts(venue);
        let handles = products.map(async (p: string) => {
            return await this.getSlotsForProducts(venue, p, date, party_size);
        });

        let results = await Promise.all(handles);

        let totals: any = [];
        results.map((r: any) => {
            if (r) {
                totals = totals.concat(r.filter((s: any) => s !== null));
            }
            return null;
        });

        return totals;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {};
        let url = `https://www.myfunnow.com/en/booking/${slot.product}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://pocket-concierge.jp/en/restaurants/243688?utm_source=restaurant_en....';
    }

}

