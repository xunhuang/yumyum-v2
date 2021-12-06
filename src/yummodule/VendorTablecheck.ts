export const VendorTablecheck = null;
/*
const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');


function time_is_dinner(tz, time) {
    let hour = moment(time).tz(tz).hours();
    return hour > 15;
}

export class VendorTablecheck extends VendorBase {

    vendorID() {
        return "tablecheck";
    }

    requiedFieldsForReservation() {
        return ["url_slug"];
    }

    async getMenuForDate(venue, date) {
        const url = `https://www.tablecheck.com/en/shops/${venue.url_slug}/menu_items`;
        const queryparam = {
            date: date,
        };

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                // console.log(res.body);
                if (!res.body.menu_items) {
                    return [];
                }

                let combined = [];

                Object.values(res.body.menu_items).map(item => {
                    if (!item.online_time_steps)
                        return null;
                    Object.values(item.online_time_steps).map(slot => {
                        combined.push(
                            {
                                time: slot[0] * 1000,
                                itemid: item.id,
                                timeoftoday: slot[1],
                                // timestr: moment(slot[0] * 1000).tz(venue.timezone).format(),
                            }
                        );
                        return null;
                    });
                    return null;
                })
                return combined;
            }, err => {
                // eat the error
                console.error("Error for tablecheck: " + err + " " + venue.name);
                console.log(err);
                return [];
            });
    }

    async getSlotAvailabilityForDate(venue, date, party_size, slot) {
        const url = `https://www.tablecheck.com/en/shops/${venue.url_slug}/available`;
        const queryparam = {};
        queryparam["reservation[start_date]"] = date;
        queryparam["reservation[start_at_epoch]"] = slot.time / 1000;
        queryparam["reservation[num_people_adult]"] = party_size;
        queryparam["reservation[orders_attributes][0][menu_item_id]"] = slot.itemid;
        queryparam["reservation[orders_attributes][0][is_group_order]"] = "true";

        return await superagent.get(url)
            .query(queryparam)
            .then((res) => {
                // if (res.body.status === "warn" || res.body.status === "success") {
                if (res.body.status === "success") {
                    return slot;
                }
                return null;
            });
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {

            let slots = await this.getMenuForDate(venue, date);

            if (timeOption === "dinner") {
                slots = slots.filter((slot) => time_is_dinner(venue.timezone, slot.time));
            } else {
                slots = slots.filter((slot) => !time_is_dinner(venue.timezone, slot.time));
            }

            let targettime = (timeOption === "lunch") ? 12 * 60 * 60 : 19 * 60 * 60;

            slots = slots.sort(function (a, b) {
                let aa = Math.abs(a.timeoftoday - targettime);
                let bb = Math.abs(b.timeoftoday - targettime);
                return aa - bb;
            });

            let slot = slots[0];
            if (!slot) {
                return [];
            }

            let result = await this.getSlotAvailabilityForDate(venue, date, party_size, slot);
            if (result) {
                return [{ time: moment(slot.time).tz(venue.timezone).format() }];
            }

            return [];
        }

        getReservationUrl(venue, date, parties, timeOption, slot) {
            let url = `https://www.tablecheck.com/shops/${venue.url_slug}/reserve`;
            return url;
        }

        getReservationUrlAction(venue, date, parties, timeOption, slot) {
            const t = moment.tz(slot.time, venue.timezone);
            return {
                method: "post",
                url: this.getReservationUrl(venue, date, parties, timeOption, slot),
                data: {
                    "reservation[start_date]": date,
                    "reservation[start_time]": t.hours() * 60 * 60 + t.minutes() * 60,
                    "reservation[num_people]": parties,
                },
            }
        }

        bankingNoteHint() {
            return 'Should look like: https://www.tablecheck.com/shops/heinzbeck/reserve';
        }

    }

    */