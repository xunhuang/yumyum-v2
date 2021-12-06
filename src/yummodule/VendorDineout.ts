import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';


const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorDineout extends VendorBase {

    vendorID() {
        return "dineout";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let datestr = `${date}T19:00:00Z`
        if (timeOption === "lunch") {
            datestr = `${date}T12:00:00Z`;
        }

        const url = `https://dineoutapieu.azurewebsites.net/api/web/suggestion/restaurant/${venue.businessid}/${datestr}/${party_size}/`;

        let slots = await superagent.get(url)
            .then((res: { body: any; }) => {
                return res.body;
            });

        slots = slots.filter((s: { isAvailable: any; }) => s.isAvailable);
        slots = slots.map((s: { date: any; }) => { return { time: moment.tz(s.date, venue.timezone).format() }; });
        return slots;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {};

        const timestr = moment.tz(slot.time, venue.timezone).format();
        let url = `https://www.dineout.is/book/reservation-policy?restaurantId=${venue.businessid}&dateTime=${timestr}&guests=${party_size}&currentStep=reservation-policy`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://www.dineout.is/restaurant?id=46&isolation=true';
    }

}