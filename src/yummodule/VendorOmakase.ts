import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorOmakase extends VendorBase {
    vendorID() {
        return "omakase";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number): Promise<TimeSlots[]> {

        const url = `https://omakase.in/users/api/availability_dates/${venue.businessid}`
        const queryparam = {
            date: date,
            // note: no party_size here
        };

        return await superagent.get(url)
            .query(queryparam)
            .set("Cookie", '__stripe_mid=858db67d-3b71-45a4-be7d-96690eea688b; _ga=GA1.2.1854444533.1574882338; cgt=; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IlcxczVNamswTUYwc0lpUXlZU1F4TVNRellrbFVZMHhrVGsxRWNYbFZaRWhsT1VKQ2FqUXVJaXdpTVRVM05UVTRORFl3TlM0d01UUXhOelF5SWwwPSIsImV4cCI6IjIwMjAtMDQtMDVUMjI6MjM6MjUuMDE0WiIsInB1ciI6bnVsbH19--2f997c731c6cd746978c19a802618113a804175e; __stripe_sid=26b2dc54-7d06-46c0-bfc2-d3e68954ac90; _gid=GA1.2.1956011019.1575584607; locale=en; _gat=1; _omakasev2_session=VfHSb0mWrMq1ntt2ktQjY1SQPEgp82nw1SahKuGBbN8RV1BE8t7vuFg7%2BSNt9bFVZdwM%2FZY84Vi1oItGql5qLd89Oo4gXHTJJ93QzmNflaODbv4H328Id7Q3dSiGZdKEOOQfnb55XZ98kIe9L%2BOFwY0zGDh7DtIfkyI7TKXbidhk4C%2Ftx5JxtTLB95ENHlna676KMhbuFM%2F66d%2BunUG7qjjP7ke%2BOUNCxl5J6BTorgPCIK19SYJk6Ba%2F7ZgWWV%2FAPQQAeWMB6zk3O9OM4pQCHGb%2BF%2B%2BNRoNgHu6qXTrGgV8naMkM3EVJejNbCym8zjnFoGlnkp6wOW8Pe7RAbX%2B45uG4XqjkDQtASjv6t0smwZ6f--bz%2FqVNxt%2Bja6yL%2Bh--cdJ6c25Ao6c8qNaGFnwYPw%3D%3D')
            .then((res: any) => {
                return res.body.data.grouped_online_stock_groups;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let types = await this.getSlotForDate(venue, date, party_size);
        let slots: any = [];

        Object.values(types).map((mytype: any) => (
            mytype.map((s: any) => slots.push(s))
        ));

        if (typeof party_size === "string") {
            party_size = parseInt(party_size);
        }
        slots = slots.filter((s: any) => s.guests_count_option_values.includes(party_size));

        let actualslots: any = [];

        slots = slots.map((s: any) => (
            s.time_options.map((timeslot: any) => {
                let wrongstarttime = moment.tz(timeslot.start_time, venue.timezone);
                console.log(timeslot);
                console.log(wrongstarttime.format("HH:mm"));
                let slot = { time: moment.tz(date + " " + wrongstarttime.format("HH:mm"), venue.timezone).format() };
                actualslots.push(slot);
                return null;
            })
        ));
        return actualslots;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://omakase.in/en/r/${venue.businessid}/reservations/new#${date.replace(/-/g, "")}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: https://omakase.in/en/r/hc778124';
    }

}
