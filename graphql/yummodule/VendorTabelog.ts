import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorTabelog extends VendorBase {
    vendorID() {
        return "tabelog";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
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
            .then((res: any) => {
                return res.body.selection;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);
        slots = Object.values(slots);
        slots = slots.map((s: any) => {
            return {
                time: moment.tz(date + " " + s.time, venue.timezone).format(),
                url: s.url,
            };
        });
        return slots;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {}
        let url = `https://tabelog.com${slot.url}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://tabelog.com/hiroshima/A3402/A340201/34005017/';
    }

}
