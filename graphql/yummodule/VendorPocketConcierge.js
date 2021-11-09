const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

class VendorPocketConcierge extends VendorBase {

    vendorID() {
        return "pocket-concierge";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue, date, party_size) {

        const url = `https://pocket-concierge.jp/en/api/restaurants/${venue.businessid}/seats.json`;
        const queryparam = {
            start_datetime: date,
            count: party_size,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                return res.body.seats;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size);
        slots = slots.filter(s => s.count_from <= party_size && s.count_to >= party_size);
        slots = slots.map(s => { return { time: moment.tz(date + " " + s.start_datetime, venue.timezone).format() }; });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://pocket-concierge.jp/en/restaurants/${venue.businessid}?seat_date_eq=${date}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://pocket-concierge.jp/en/restaurants/243688?utm_source=restaurant_en....';
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}

exports.VendorPocketConcierge = VendorPocketConcierge;