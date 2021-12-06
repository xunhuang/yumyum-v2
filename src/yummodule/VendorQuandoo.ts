import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');

type NewType = VenueVendorInfo;

export class VendorQuandoo extends VendorBase {
    vendorID() {
        return "quandoo";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

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
            .then((res: any) => {
                return res.body.options;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);

        slots = slots.filter((s: any) => s.available);
        slots = slots.map((s: any) => {
            return {
                time: s.dateTime,
            }
        });
        return slots;
    }

    getReservationUrl(venue: NewType, date: string, party_size: number, timeOption: string): string | null {
        let url = venue.bookingnotes;
        return url!;
    }

    bankingNoteHint() {
        return 'Should look like: https://www.quandoo.co.uk/place/little-kolkata-50043';
    }
}