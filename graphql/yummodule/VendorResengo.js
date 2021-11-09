const { VendorBase } = require("./VendorBase");

const superagent = require('superagent');
const moment = require('moment-timezone');

class VendorResengo extends VendorBase {
    vendorID() {
        return "resengo.com";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async getSlotForDate(venue, date, party_size, timeOption, clientID, cat) {
        const d = moment(date);
        const url = `https://api.resengo.com/v2/company/${venue.businessid}/flow/101/availability/${d.format("YYYY/MM/DD")}`;
        const queryparam = {
            cid: clientID,
            CategoryID: cat,
            Date: date + "T00:00:00",
            NOPersons: party_size,
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                // console.log(res.text);
                let body = JSON.parse(res.text);
                return body;
            });
    }

    async getClientID(venue) {
        const url = "https://www.resengo.com/pf/flow/contextFromCompany";
        const queryparam = {
            integrationAction: "book",
            companyId: venue.businessid,
        }
        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                return res.body.clientID;
            });
    }

    async getCategories(venue, clienID) {
        const url = `https://api.resengo.com/v2/company/${venue.businessid}/flow/101/initialstepconfiguration`;
        const queryparam = {
            cid: clienID,
        }

        return await superagent.get(url)
            .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')
            .set('Content-Type', "application/json; charset=UTF-8")
            .query(queryparam)
            .then((res) => {
                return res.body.categories.map(cat => {
                    return cat.categoryID;
                });
            });
    }

    async venueSearch(venue, date, party_size, timeOption) {
        let clientID = await this.getClientID(venue);
        console.log(clientID);
        let categories = await this.getCategories(venue, clientID);
        console.log(categories);

        let total = [];
        let handles = categories.map(cat => {
            return this.getSlotForDate(venue, date, party_size, timeOption, clientID, cat)
                .then(data => {
                    data.map(slot => {
                        let dstr = moment.tz(slot.arrivalTime, venue.timezone).format();
                        total.push(dstr);
                    });
                });

        });

        await Promise.all(handles);

        const dedup = [... new Set(total)].map(t => {
            let s = { time: t }
            return s;
        });
        return dedup;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = `https://www.resengo.com/Flow/`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                CompanyId: venue.businessid,
            }
        });
        return reservationUrl;
    }

    bankingNoteHint() {
        return "https://www.resengo.com/Flow/?CompanyId=473771&ForceLC=NL";
    }

    async fetchVenueInfoFromURL(redirect_url) {
        return null;
    }
}

exports.VendorResengo = VendorResengo;