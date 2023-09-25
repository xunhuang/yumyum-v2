import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorRestaurantes extends VendorBase {
    vendorID() {
        return "restaurantes";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

        const url = `https://www.restaurantes.com/widgetmichelin/${venue.businessid}/availability`;
        const queryparam = {
            date: date,
            timeFrom: "09:00",
            timeTo: "21:00",
            partySize: party_size,
            languageCode: "en-GB",
            partnerCode: "INTL-MICHELIN%3A6645",
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res: any) => {
                console.log(res.text);
                let body = JSON.parse(res.text);
                if (body.availabilityResult !== "Yes") {
                    return [];
                }
                return body.areas;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        let areas = await this.getSlotForDate(venue, date, party_size, timeOption);
        let total: any = [];
        areas.map((area: any) => {
            area.sessions.map((session: any) => {
                session.slots.map((slot: any) => {
                    let dstr = moment.tz(slot.time.local, venue.timezone).format();
                    total.push(dstr);
                    return null;
                })
                return null;
            })
            return null;
        })

        const dedup = [...new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });
        return dedup as TimeSlots[];
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        const slot: any = {};
        let url = `https://www.restaurantes.com/en/widgetmichelin/index/${venue.businessid}/ccg`;
        let timestr = moment(slot.time).tz(venue.timezone).format("HH:mm")
        let reservationUrl = buildUrl(url, {
            queryParams: {
                hour: date + "T" + timestr,
                partySize: party_size,
                time: timestr,
                date: date,
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return "https://www.restaurantes.com/en/widgetmichelin/index/12334/ccg";
    }
}
