import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');
const buildUrl = require('build-url');

export class VendorCovermanager extends VendorBase {
    vendorID() {
        return "covermanager";
    }

    requiedFieldsForReservation() {
        return ["businessid"]
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
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
            .then((res: any) => {
                let myresult = JSON.parse(res.text);
                let slots = myresult.res.people[party_size.toString()];
                if (!slots) {
                    slots = [];
                }
                return slots;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let answers = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total: any = [];
        Object.keys(answers).map(slot => {
            let dstr = date + " " + slot + ":00";
            total.push(moment.tz(dstr, venue.timezone).format());
            return null;
        });

        const dedup = [...new Set(total)].map((t: any) => {
            let s = { time: t as string }
            return s;
        });

        return dedup;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {};
        let url = `https://www.covermanager.com/reservation/module_restaurant/${venue.businessid}/`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                people: party_size,
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