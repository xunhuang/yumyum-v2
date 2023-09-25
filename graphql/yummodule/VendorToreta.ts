import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');


export class VendorToreta extends VendorBase {
    vendorID() {
        return "toreta";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<string[]> {

        const url = `https://yoyaku.toreta.in/web/v1/web_reservations/${venue.businessid}/days.json`;
        const queryparam = {
            year: moment(date).year(),
            month: moment(date).month() + 1,
            seats: party_size,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res: any) => {
                let slots: string[] = [];
                res.body.result.days.forEach((day: any) => {
                    if (day) {
                        day.forEach((slot: any) => {
                            let slottime = moment.tz(slot.start_at * 1000, venue.timezone);
                            if (slottime.format("YYYY-MM-DD") === date) {
                                slots.push(slottime.format());
                            }
                        });
                    }
                });
                return slots;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);
        return slots.map((s: string) => { return { time: s }; });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://yoyaku.toreta.in/${venue.url_slug}/#`;
        return url;
    }

    bankingNoteHint() {
        return 'should look like https://yoyaku.toreta.in/les-alchimistes/#/';
    }
}
