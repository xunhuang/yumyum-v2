import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorIkyu extends VendorBase {
    vendorID() {
        return "ikyu";
    }
    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number): Promise<TimeSlots[]> {
        const url = `https://restaurant.ikyu.com/api/v1/restaurants/${venue.businessid}/plans`;

        const queryparam = {
            visit_date: date,
            num_guests: party_size,
            embed: "available_hours,seat_properties,seat_properties",
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res: any) => {
                return res.body.plans;
            }, (err: any) => {
                // eat the error
                console.error("Error for ikyu: " + err + " " + venue.name);
                console.log(err);
                return [];
            });
    }

    async getCalendarDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        const url = `https://restaurant.ikyu.com/api/v1/restaurants/${venue.businessid}/calendar`;

        const queryparam = {
            num_guests: party_size,
        };
        const d = moment(date);

        return await superagent.get(url)
            .query(queryparam)
            .then((res: any) => {
                let results = res.body[timeOption];
                if (!results) {
                    return false;
                }
                let entry: any;
                results.map((period: any) => {
                    if (period.year === d.year() && period.month === d.month() + 1) {
                        entry = period.days;
                    }
                    return null;
                })

                if (!entry) return false;
                for (let i = 0; i < entry.length; i++) {
                    let day = entry[i];
                    if (day.day === d.date()) {

                        if (day.has_inventory) {
                            return true;
                        }
                    }
                }
                return false;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        let [plans, avail] = await Promise.all(
            [
                this.getSlotForDate(venue, date, party_size),
                this.getCalendarDate(venue, date, party_size, timeOption),
            ]);
        if (!avail) {
            return [];
        }

        let slots: any = [];

        plans.forEach((course: any) => {
            let slots_for_course = course.available_hours.filter((slot: any) => slot.is_available);
            slots = slots.concat(slots_for_course);
        })
        slots = slots.map((s: any) => {
            return {
                time: moment.tz(date + " " + s.time, venue.timezone).format()
            };
        });
        return slots;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const d = moment(date);
        let url = `https://restaurant.ikyu.com/111838/${timeOption}/?pusy=${d.year()}&pusm=${d.month() + 1}&pusd=${d.date()}&pups=${party_size}`
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://restaurant.ikyu.com/111838/';
    }

}

