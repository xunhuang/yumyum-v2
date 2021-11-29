const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

export class VendorEat2Eat extends VendorBase {
    vendorID() {
        return "eat2eat";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    async getSlotForDate(venue, date, party_size, timeOption) {

        let datestr = moment(date).format("L");

        let timezone = "China Standard Time";

        if (venue.timezone === "Asia/Singapore") {
            timezone = "Singapore Standard Time";
        } else if (venue.timezone === "Asia/Bangkok") {
            timezone = "SE Asia Standard Time";
        }

        const data = {
            restaurantId: venue.businessid,
            adults: "" + party_size,
            children: "NaN",
            reservationDate: datestr,
            diningTime: (timeOption === "dinner") ? "07:00 PM" : "12:00 PM",
            promotionId: "0",
            reservationId: "",
            timeZone: timezone,
            channelLink: `https://www.eat2eat.com/${venue.url_slug}/`,
            isPromotionCampaign: "false",
            urlPromotion: "0",
        };

        const datastr = JSON.stringify(data);
        const url = `http://www.eat2eat.com/${venue.url_slug}/Pages/AjaxCall.aspx/RealTimeAvailabilityCheck`;
        return await superagent.post(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .send(datastr)
            .then((res) => {
                return res.body.d;
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let slots = await this.getSlotForDate(venue, date, party_size, timeOption);

        slots = slots.filter(s => s.IsRealTimeSlotAvailable);
        slots = slots.map(s => {
            let d = moment(date + " " + s.Time,
                'YYYY-MM-DD h:mm a').format("YYYY-MM-DD HH:mm:SS");
            let datestr = moment.tz(d, venue.timezone).format();
            return {
                time: datestr,
            }
        });
        return slots;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `http://www.eat2eat.com/${venue.url_slug}/Pages/Reservation.aspx?relId=${venue.businessid}`;
        return url;
    }

    bankingNoteHint() {
        return 'Should look like: http://www.eat2eat.com/FourSeasons/Pages/Reservation.aspx?relId=MwAyADgAMgA=&lang=0&pro=0&br=0&ho=0&res=0&ci=0&ms=1030';
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}
