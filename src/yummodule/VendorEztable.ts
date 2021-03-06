import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');
const buildUrl = require('build-url');

export class VendorEztable extends VendorBase {
    vendorID() {
        return "eztable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        const url = `https://api.eztable.com/v3/hotpot/quota/${date}?`;

        const queryparam = {
            restaurant_id: venue.businessid,
            people: party_size,
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res: any) => {
                return res.body.times;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let times = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total = times.map(time => {
            let dstr = date + " " + time + ":00";
            return moment.tz(dstr, venue.timezone).format();
        });

        const dedup = [...new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });

        return dedup;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://en.eztable.com/restaurant/${venue.businessid}/booking`;

        let reservationUrl = buildUrl(url, {
            queryParams: {
                people: party_size,
                date: date,
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return `https://en.eztable.com/restaurant/605/booking`;
    }

}
