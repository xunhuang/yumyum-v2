const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorDineout extends VendorBase {

    vendorID() {
        return "dineout";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {
        let datestr = `${date}T19:00:00Z`
        if (timeOption === "lunch") {
            datestr = `${date}T12:00:00Z`;
        }

        const url = `https://dineoutapieu.azurewebsites.net/api/web/suggestion/restaurant/${venue.businessid}/${datestr}/${party_size}/`;

        return await superagent.get(url)
            .then((res) => {
                // console.log(res.body);
                return res.body;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size);
        slots = slots.filter(s => s.isAvailable);
        slots = slots.map(s => { return { time: moment.tz(s.date, venue.timezone).format() }; });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {

        const timestr = moment.tz(slot.time, venue.timezone).format();
        let url = `https://www.dineout.is/book/reservation-policy?restaurantId=${venue.businessid}&dateTime=${timestr}&guests=${parties}&currentStep=reservation-policy`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://www.dineout.is/restaurant?id=46&isolation=true';
    }

}