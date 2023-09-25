import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';

const superagent = require('superagent');
const moment = require('moment-timezone');

async function dinesuperb_search_internal(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string, experience_id: string | null)
    : Promise<TimeSlots[]> {
    const url = "https://api.dinesuperb.com/availability/times";
    let data: any = {
        restaurant: venue.businessid,
        guests: party_size,
        date: date,
        online: 1,
    };

    if (experience_id) {
        data["experience"] = experience_id;
    }

    return await superagent.get(url)
        .query(data)
        .then((res: any) => {
            let total: any = [];
            if (!res.body.data) {
                return [];
            }

            let dateslots = res.body.data;
            console.log("Dinesuperb", res.body);
            if (dateslots) {
                dateslots.forEach(function (data: any) {
                    data.times.forEach(function (slot: any) {
                        let hour = Math.floor(slot.time / 60);
                        let minutes = slot.time % 60;
                        let hrstr = ("0" + hour).slice(-2);
                        let minstr = ("0" + minutes).slice(-2);
                        let ddd = `${date} ${hrstr}:${minstr}:00`;
                        let datestr =
                            moment.tz(ddd, venue.timezone).format();
                        total.push({
                            time: datestr,
                        });
                    });
                });
                return total;
            }
            return [];
        });
}

async function dinesuperb_experiences(venue: VenueVendorInfo) {

    const url = "https://api.dinesuperb.com/experience";
    let data = {
        restaurant: venue.businessid,
    };

    return await superagent.get(url)
        .query(data)
        .then((res: any) => {
            let total: any = [];
            if (!res.body.data) {
                return [];
            }

            let experience = res.body.data;
            if (experience) {
                experience.forEach(function (data: any) {
                    total.push(data.id);
                });
                return total;
            }
            return [];
        });
}

export class VendorDinesuperb extends VendorBase {

    vendorID() {
        return "dinesuperb";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        if (venue.resy_city_code !== "expr_first") {
            return await dinesuperb_search_internal(venue, date, party_size, timeOption, null);
        }

        // WTF need to fetch the expereince list first. 

        let experiences = await dinesuperb_experiences(venue);

        let allresults: any = [];
        let handles = experiences.map(async (exp: any) => {
            let result = await dinesuperb_search_internal(venue, date, party_size, timeOption, exp);
            allresults = allresults.concat(result);
        });

        await Promise.all(handles);
        return allresults;
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://${venue.url_slug}.dinesuperb.com`;
        // SAD: there is no date/party link here... :(
        return url;
    }

}