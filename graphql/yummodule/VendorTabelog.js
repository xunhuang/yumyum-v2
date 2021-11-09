const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

class VendorTabelog extends VendorBase {
    vendorID() {
        return "tabelog";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {

        const url = "https://tabelog.com/booking/calendar/find_vacancy/";
        const queryparam = {
            rst_id: venue.businessid,
            svd: date.replace(/-/g, ""),
            svt: (timeOption === "dinner") ? "1900" : "1200",
            svps: party_size,
            plan_id: "",
            seat_id: "",
            seat_only: "false",
            coupon_id: "",
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                return res.body.selection;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {

        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);
        console.log(slots);
        slots = Object.values(slots);
        slots = slots.map(s => {
            return {
                time: moment.tz(date + " " + s.time, venue.timezone).format(),
                url: s.url,
            };
        });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://tabelog.com${slot.url}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://tabelog.com/hiroshima/A3402/A340201/34005017/';
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}

exports.VendorTabelog = VendorTabelog;