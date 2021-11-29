const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');
export class VendorSevenrooms extends VendorBase {
    vendorID() {
        return "sevenrooms";
    }
    requiedFieldsForReservation() {
        return ["url_slug"];
    }

    async venueSearch(venue, date, party_size, timeOption) {
        const url = "https://www.sevenrooms.com/api-yoa/availability/widget/range";
        return await superagent.get(url)
            .query({
                venue: venue.url_slug,
                time_slot: (timeOption === "dinner") ? "19:00" : "12:00",
                party_size: party_size,
                halo_size_interval: 16,
                start_date: date,
                num_days: 3,
                channel: "WIDGET",
            })
            .then((res) => {
                let total = [];
                if (!res.body.data) {
                    return [];
                }

                let dateslots = res.body.data.availability[date];
                if (dateslots) {
                    // console.log(dateslots);
                    let sections = dateslots;
                    sections.forEach(section => {
                        let slots = section.times;
                        slots.forEach(function (slot) {
                            if (slot.access_persistent_id) {
                                let datestr =
                                    moment.tz(slot.time_iso, venue.timezone).format();
                                total.push({
                                    time: datestr,
                                });
                            }
                        });

                    });
                    return total;
                }
                return [];

            });
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://www.sevenrooms.com/reservations/${venue.url_slug}`;
        // SAD: there is no date/party link here... :(
        return url;
    }
}
