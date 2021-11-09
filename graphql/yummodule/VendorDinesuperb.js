const { VendorBase } = require("./VendorBase");
const superagent = require('superagent');
const moment = require('moment-timezone');

async function dinesuperb_search_internal(venue, date, party_size, timeOption, experience_id = null) {
    const url = "https://api.dinesuperb.com/availability/times";
    let data = {
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
        .then((res) => {
            let total = [];
            if (!res.body.data) {
                return [];
            }

            let dateslots = res.body.data;
            console.log(res.body);
            if (dateslots) {
                dateslots.forEach(function (data) {
                    data.times.forEach(function (slot) {
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

async function dinesuperb_experiences(venue) {

    const url = "https://api.dinesuperb.com/experience";
    let data = {
        restaurant: venue.businessid,
    };

    return await superagent.get(url)
        .query(data)
        .then((res) => {
            let total = [];
            if (!res.body.data) {
                return [];
            }

            let experience = res.body.data;
            if (experience) {
                experience.forEach(function (data) {
                    total.push(data.id);
                });
                return total;
            }
            return [];
        });
}

class VendorDinesuperb extends VendorBase {

    vendorID() {
        return "dinesuperb";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async venueSearch(venue, date, party_size, timeOption) {
        if (venue.resy_city_code !== "expr_first") {
            return await dinesuperb_search_internal(venue, date, party_size, timeOption, null);
        }

        // WTF need to fetch the expereince list first. 

        let experiences = await dinesuperb_experiences(venue);

        let allresults = [];
        let handles = experiences.map(async (exp) => {
            let result = await dinesuperb_search_internal(venue, date, party_size, timeOption, exp);
            allresults = allresults.concat(result);
        });

        await Promise.all(handles);
        return allresults;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://${venue.url_slug}.dinesuperb.com`;
        // SAD: there is no date/party link here... :(
        return url;
    }

}

exports.VendorDinesuperb = VendorDinesuperb;