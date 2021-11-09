const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');
const buildUrl = require('build-url');

class VendorCovermanager extends VendorBase {
    vendorID() {
        return "covermanager";
    }

    requiedFieldsForReservation() {
        return ["businessid"]
    }

    async getSlotForDate(venue, date, party_size, timeOption) {
        const url = 'https://www.covermanager.com/reservation/update_hour_people';
        const queryparam = {
            // language: "english",
            language: "spanish",
            restaurant: venue.businessid,
            dia: moment(date).format("DD-MM-YYYY"),
            people: party_size,
            only_this_people: "",
            min_people: "",
            max_people: "",
            time_fix: "",
        };

        let data = buildUrl(null, {
            queryParams: queryparam
        }).substring(1);
        return await superagent.post(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .send(data)
            .then((res) => {
                let myresult = JSON.parse(res.text);
                let slots = myresult.res.people[party_size.toString()];
                if (!slots) {
                    slots = [];
                }
                return slots;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let answers = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total = [];
        Object.keys(answers).map(slot => {
            let dstr = date + " " + slot + ":00";
            total.push(moment.tz(dstr, venue.timezone).format());
        });

        const dedup = [... new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });

        return dedup;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://www.covermanager.com/reservation/module_restaurant/${venue.businessid}/`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                people: parties,
                day: date,
                hour: moment(slot.time).tz(venue.timezone).format("HH:mm"),
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return `https://www.covermanager.com/reservation/module_restaurant/blanblah/`;
    }
}

exports.VendorCovermanager = VendorCovermanager;