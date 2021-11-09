const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

class VendorQuandoo extends VendorBase {
    vendorID() {
        return "quandoo";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {

        const url = `https://9110-api.quandoo.com/merchants/${venue.businessid}/reservation-options`;
        const queryparam = {
            date: date,
            capacity: party_size,
            agentId: 3,
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                return res.body.options;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);

        slots = slots.filter(s => s.available);
        slots = slots.map(s => {
            return {
                time: s.dateTime,
            }
        });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = venue.bookingnotes;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://www.quandoo.co.uk/place/little-kolkata-50043';
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}

exports.VendorQuandoo = VendorQuandoo;