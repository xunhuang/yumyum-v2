const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const cheerio = require('cheerio');
const urlparse = require('url');
const moment = require('moment-timezone');


class VendorToreta extends VendorBase {
    vendorID() {
        return "toreta";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async getSlotForDate(venue, date, party_size) {

        const url = `https://yoyaku.toreta.in/web/v1/web_reservations/${venue.businessid}/days.json`;
        const queryparam = {
            year: moment(date).year(),
            month: moment(date).month() + 1,
            seats: party_size,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                let slots = [];
                res.body.result.days.map(day => {
                    if (day) {
                        day.map(slot => {
                            let slottime = moment.tz(slot.start_at * 1000, venue.timezone);
                            if (slottime.format("YYYY-MM-DD") === date) {
                                slots.push(slottime.format());
                            }
                        });
                    }
                });
                return slots;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size);
        slots = slots.map(s => { return { time: s }; });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://yoyaku.toreta.in/${venue.url_slug}/#`;
        return url;
    }

    bankingNoteHint() {
        return 'should look like https://yoyaku.toreta.in/les-alchimistes/#/';
    }
}

exports.VendorToreta = VendorToreta;