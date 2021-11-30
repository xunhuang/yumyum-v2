const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');
const buildUrl = require('build-url');

export class VendorZenchef extends VendorBase {
    vendorID() {
        return "zenchef";
    }

    requiedFieldsForReservation() {
        return ["businessid"]
    }

    async getSlotForDate(venue, date, party_size, timeOption) {
        const url = "https://bookings-middleware.zenchef.com/getAvailabilities"
        const queryparam = {
            restaurantId: venue.businessid,
            date_begin: date,
            date_end: date,
        };

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                return res.body;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {

        let answers = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total = [];
        answers.map(day => {
            if (day.date === date) {
                day.shifts.map(shift => {
                    if (shift.marked_as_full) {
                        return null;
                    }
                    shift.shift_slots.map(slot => {
                        let peoplemap = slot.capacity.turn_times;
                        let item = peoplemap[party_size + "_pax_slots"]
                        if (item) {
                            let dstr = date + " " + slot.name + ":00";
                            total.push(moment.tz(dstr, venue.timezone).format());
                        }
                        return null;

                    })
                    return null;
                });
            }
            return null;
        });

        const dedup = [...new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });

        return dedup;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {

        let url = "https://bookings.zenchef.com/results";
        let reservationUrl = buildUrl(url, {
            queryParams: {
                rid: venue.businessid,
                pax: parties, // pax is working
                day: date,
                type: "web",
                pid: 1001,
                mini: 1,
                fullscreen: 1,
                lang: "en",
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return "https://bookings.zenchef.com/results?rid=352496&type=web&pid=1001&mini=1&fullscreen=1&lang=en";
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}