const { VendorBase } = require("./VendorBase");

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

    async getProducts(venue) {
        // const url = `https://michelin.myfunnow.com/en/branches/${venue.businessid}`;
        const url = `https://www.myfunnow.com/en/branches/${venue.businessid}`;

        return await superagent.get(url)
            .then((res) => {
                const $ = cheerio.load(res.text);
                let schemaText = $("script").map(function (i, el) {
                    let text = cheerio(el).html();
                    if (text.includes('"@type":"ItemList"')) {
                        return text;
                    }
                    return "";
                }).get().join(' ')

                let json = JSON.parse(schemaText);

                let products = json.itemListElement.map(item => {
                    var url_parts = urlparse.parse(item.url, true);
                    var path_parts = url_parts.path.split("/");


                    let last = path_parts[path_parts.length - 1];

                    return last;
                });

                return products;
            });
    }

    async getSlotsForProducts(venue, product_id, date, parties) {

        const url = `https://api-go.myfunnow.com/v2/funnow/pub/product/${product_id}/arrivaltimes`;
        const queryparam = {
            count: parties,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                let slots = res.body.data.data;
                if (!slots) {
                    return null;
                }
                slots = slots.filter(s => {
                    return moment.tz(s.promostart, venue.timezone).format("YYYY-MM-DD") === date;
                });

                return slots.map(s => {
                    return {
                        time: moment.tz(s.promostart, venue.timezone).format(),
                        product: product_id,
                    }
                })
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let products = await this.getProducts(venue);
        let handles = products.map(async (p) => {
            return await this.getSlotsForProducts(venue, p, date, party_size);
        });

        let results = await Promise.all(handles);

        let totals = [];
        results.map(r => {
            if (r) {
                totals = totals.concat(r.filter(s => s !== null));
            }
            return null;
        });

        return totals;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://www.myfunnow.com/en/booking/${slot.product}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://pocket-concierge.jp/en/restaurants/243688?utm_source=restaurant_en....';
    }

}

