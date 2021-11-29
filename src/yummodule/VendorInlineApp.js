const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorInlineApp extends VendorBase {
    vendorID() {
        return "inline";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {

        const url = `https://inline.app/booking/api/getBookingCapacities`;

        const queryparam = {
            companyId: venue.businessid,
            branchId: venue.url_slug,
            groupSize: party_size,
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                // console.log(res.body);
                return res.body;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {

        let answers = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total = [];
        Object.values(answers).map(slots => {
            let dates = slots.filter(d => d.date === date);
            if (dates.length !== 1) {
                return [];
            }
            let times = dates[0].times;


            for (var key in times) {
                if (times[key] === "open") {
                    let dstr = date + " " + key + ":00";
                    total.push(moment.tz(dstr, venue.timezone).format());
                }
            }
            return null;
        });

        const dedup = [...new Set(total)].map(t => {
            let s = {
                time: t
            }
            return s;
        });

        return dedup;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://inline.app/booking/${venue.businessid}/${venue.url_slug}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://inline.app/booking/impromptu/-LHc6eHwN-k9m52dJVb7';
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}
