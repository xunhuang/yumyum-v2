import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');
export class VendorBookarestaurant extends VendorBase {

    vendorID() {
        return "bookarestaurant";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }
    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        const url = `https://www.bookarestaurant.com/widget/AvailableTimeSlotBookingWidget/${venue.businessid}/en-AU`;
        return await superagent.post(url)
            .query({
                isSpecialOffers: "false",
                ReferrerKey: "",
                bookingSourceID: 3,
                randomNumber: Math.floor(Math.random() * 6000),
            })
            .set('content-type', "application/json; charset=UTF-8")
            .send({
                mealPeriodID: (timeOption === "dinner") ? 7 : 4,
                partysize: party_size,
                sittingDate: date,
            })
            .then((res: { body: { TimeSlotList: any; }; }) => {
                let total: { time: any; }[] = [];
                if (!res.body || !res.body.TimeSlotList) {
                    return [];
                }
                let slots = res.body.TimeSlotList;
                slots.forEach(function (slot: { SittingTime: string; }) {
                    let d = moment(date + " " + slot.SittingTime,
                        'YYYY-MM-DD h:mm a').format("YYYY-MM-DD HH:mm:SS");
                    let datestr = moment.tz(d, venue.timezone).format();
                    total.push({
                        time: datestr,
                    });
                });
                return total;
            });
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        // SAD: there is no date/party deep link here... :(
        let url = `https://www.bookarestaurant.com/widget/BookingWidgetView/${venue.businessid}/${venue.url_slug}/3/en-US`;
        return url;
    }
}