import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorPocketConcierge extends VendorBase {

    vendorID() {
        return "pocket-concierge";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        const url = `https://pocket-concierge.jp/en/api/restaurants/${venue.businessid}/seats.json`;
        const queryparam = {
            start_datetime: date,
            count: party_size,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res: any) => {
                return res.body.seats;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);
        slots = slots.filter((s: any) => s.count_from <= party_size && s.count_to >= party_size);
        slots = slots.map((s: any) => { return { time: moment.tz(date + " " + s.start_datetime, venue.timezone).format() }; });
        return slots;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://pocket-concierge.jp/en/restaurants/${venue.businessid}?seat_date_eq=${date}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://pocket-concierge.jp/en/restaurants/243688?utm_source=restaurant_en....';
    }

}