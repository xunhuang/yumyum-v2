const { VendorBase } = require("./VendorBase");
const buildUrl = require('build-url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const urlparse = require('url');
const moment = require('moment-timezone');
class VendorBookatable extends VendorBase {
    vendorID() {
        return "bookatable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }

    async venueSearch(venue, date, party_size, timeOption) {

        let url = `https://gw.bookatable.com/widget/v1/restaurant/${venue.businessid}/availability`;
        let timeFrom = (timeOption === "dinner") ? "18:00" : "11:30";
        let timeTo = (timeOption === "dinner") ? "20:00" : "13:30";
        let data = {
            biz_id: venue.businessid,
            partySize: party_size,
            date: date,
            timeFrom: timeFrom,
            timeTo: timeTo,
            languageCode: "en-GB",
            partnerCode: "INTL-MICHELIN:51519",
        };

        return await superagent.get(url)
            .set('Origin', "https://guide.michelin.com")
            .set('x-bat-client-id', '482A439EAF0341019A9FD5924597C0FD')
            .query(data)
            .then(res => {
                let total = [];
                if (res.body.availabilityResult === "No") {
                    return [];
                }

                res.body.areas.map(area => {
                    area.sessions.map(session => {
                        session.slots.forEach(function (slot) {
                            let datestr =
                                moment.tz(slot.time.local, venue.timezone).format();
                            total.push({
                                areaid: area.id,
                                time: datestr,
                            });
                        });
                    }
                    );

                });
                return total;
            });
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        let url = "https://availabilitywidget.bookatable.com/index.html";
        let reservationUrl = buildUrl(url, {
            queryParams: {
                lang: "en-GB",
                cid: "INTL-MICHELIN:51519",
                rid: venue.businessid,
                gtmid: "GTM-NND8XGT",
                theme: "michelin",
                clid: "482A439EAF0341019A9FD5924597C0FD",
                dfdate: date,
                dfcovs: parties,
                dflid: slot.areaid,
                dfsid: (timeOption === "dinner") ? "DINNER" : "LUNCH",
                dftime: moment(slot.time).tz(venue.timezone).format("HH:mm"),
                sltime: (timeOption === "dinner") ? "19:00" : "12:00",
            }
        });
        return reservationUrl + "#details";
    }

    // This code didn't work well. 
    // async vendor_entity_search1(term, longitude, latitude) {
    //     const url = "https://www.bookatable.co.uk/api/search-suggestions";
    //     return await superagent.get(url)
    //         .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
    //         .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
    //         .set('Accept', '*/*')
    //         .query({
    //             q: term,
    //             culture: "en-GB",
    //         })
    //         .then((res) => {
    //             let result = res.body.restaurants.items.map(item => {
    //                 return {
    //                     businessid: item.id,
    //                     name: item.name,
    //                     generatedUrl: item.generatedUrl,
    //                     city: item.city,
    //                 };
    //             });
    //             return result.slice(0, 5);  // first 5

    //         });
    // }
    async vendor_entity_search(term, longitude, latitude) {
        const url = "https://www.bookatable.co.uk/search-listings/en-GB";
        return await superagent.get(url)
            .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
            .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
            .set('Accept', '*/*')
            .query({
                latitude: latitude,
                longitude: longitude,
                nearme: "true",
                c: "auto_nearme",
            })
            .then((res) => {
                const $ = cheerio.load(res.text);
                // console.log(res.text);
                let searchresult = $("script").map(function (i, el) {
                    let text = cheerio(el).html();
                    if (text.includes('__INITIAL_STATE__')) {
                        return text.replace("window.__INITIAL_STATE__ =", "")
                            .replace("};", "}");
                    }
                    return "";
                }).get().join(' ')
                if (searchresult !== "") {
                    let result = JSON.parse(searchresult);
                    // console.log(result.listing.results);
                    result = result.listing.results.map(item => {
                        return {
                            businessid: item.id,
                            name: item.name,
                            distance: item.distance,
                            latitude: item.geolocation.latitude,
                            longitude: item.geolocation.longitude,
                            // generatedUrl: item.generatedUrl,
                            // city: item.city,
                        };
                    });

                    console.log("prefilter size = " + result.length);  // first 5

                    result = result.filter(item => item.distance < 30);
                    return result.slice(0, 5);  // first 5
                }

            });
    }

    async fetchVenueInfoFromSearchItem(item) {
        return await this.fetchVenueInfoFromURL(item.generatedUrl);
    }

    async fetchVenueInfoFromURL(url) {
        return await superagent.get(url)
            .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36')
            .set('accept-language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7')
            .set('Accept', '*/*')
            .redirects(5)
            .then((res) => {
                let venue = {};
                const $ = cheerio.load(res.text);
                let schemaText = $("script").map(function (i, el) {
                    let text = cheerio(el).html();
                    if (text.includes('schema.org')) {
                        return text;
                    }
                    return "";
                }).get().join(' ')
                if (schemaText !== "") {
                    let schema = JSON.parse(schemaText);
                    venue.latitude = schema["@graph"][0].geo.latitude;
                    venue.longitude = schema["@graph"][0].geo.longitude;
                }
                return venue;
            })
            .catch(err => {
                console.log("error : " + err);
                return null;
            });
    }
}

exports.VendorBookatable = VendorBookatable;