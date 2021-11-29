const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');
const cheerio = require('cheerio');
const buildUrl = require('build-url');

export class VendorChope extends VendorBase {

    vendorID() {
        return "chope";
    }

    requiedFieldsForReservation() {
        return ["url_slug"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {

        const url = "https://book.chope.co/inner_api/get_times";

        const queryparam = {
            rid: venue.url_slug,
            date: moment(date).format("D MMM YYYY"),
            selected_time: (timeOption === "dinner") ? "7:00 pm" : "12:00 pm",
            adults: parseInt(party_size),
            children: 0,
            reservation_id: 0,
            confirmationCode: 0,
            source: "Michelin",
            smart: 1,
            smart_level: 1,
        };

        return await superagent.post(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('X-Requested-With', "XMLHttpRequest")
            .set('Accept', 'application/json')
            .set('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8")
            .send(queryparam)
            .then((res) => {
                // let t = res.res.text; // not a valid json
                let t = res.text; // not a valid json
                let a = JSON.parse(t);
                let slots = [];
                if (a.data.return_str) {
                    const $ = cheerio.load(a.data.return_str);

                    $("a").map((n, entry) => {
                        slots.push(entry.attribs.val);
                        return null;
                    });
                }
                return slots;

            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);
        slots = slots.map(s => {

            let t = moment(s, "h:m a");
            return { time: moment.tz(date + " " + t.format("HH:mm"), venue.timezone).format() };
        });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        // https://book.chope.co/booking?rid=diningconceptbombay1709bbd&adults=3&source=Michelin&d=8%20Dec%202019&t=6:00%20pm&smart=1

        let url = "https://book.chope.co/booking";

        let reservationUrl = buildUrl(url, {
            queryParams: {
                rid: venue.url_slug,
                adults: parties,
                source: "Michelin",
                d: moment.tz(date, venue.timezone).format("D MMM YYYY"),
                t: moment.tz(slot.time, venue.timezone).format("h:mm a"),
                smart: 1,
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return 'Should look like: https://book.chope.co/booking?rid=diningconceptbombay1709bbd&source=Michelin';
    }
}