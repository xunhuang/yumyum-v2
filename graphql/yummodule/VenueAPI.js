const buildUrl = require('build-url');
const moment = require('moment-timezone');
const { getVendor } = require("./Vendors")
const { MetroAPI } = require('./MetroAPI.js');
const { snapshotToArrayData } = require('./YumUtil.js').YumUtil;


class VenueClass {
    getReservationURL(datestr, party_size, timeOption = "dinner", slot) {
        let vendor = getVendor(this.reservation);
        if (vendor) {
            return vendor.getReservationUrl(this, datestr, party_size, timeOption, slot);
        }
        return null;
    }

    getReservationUrlAction(datestr, party_size, timeOption, slot) {
        let vendor = getVendor(this.reservation);
        if (vendor) {
            return vendor.getReservationUrlAction(this, datestr, party_size, timeOption, slot);
        }
        return null;
    }

    isReservationSupported() {
        let vendor = getVendor(this.reservation);
        if (vendor) {
            return true;
        }
        return false;
    }

    getArea() {
        if (this.city) {
            return this.city;
        }
        if (this.area) {
            return this.area;
        }

        return "unknown";
    }

    getUrl() {
        if (!this.realurl) {
            return null;
        }
        if (this.realurl.startsWith("http")) {
            return this.realurl;
        }

        return "http://" + this.realurl;
    }

    getPhotosList() {
        return (this.imageList) ? this.imageList : [];
    }
}

const VenueObject = (v) => {
    return Object.assign(new VenueClass(), v);
}

var Venues = [];
var VenuesMap = {};
var db = null;

const VenueAPI = {
    init: function (dbinput = null) {
        db = dbinput;
    },
    withReservationSupport: function () {
        return Venues.filter(v => v.withOnlineReservation);
    },
    objectfy: (venue) => {
        return VenueObject(venue);
    },
    lookupVenueByKey: async (venuekey) => {
        let venue = VenuesMap[venuekey];
        if (venue) {
            return venue;
        }

        let v = await db.collection("venues")
            .where("key", "==", venuekey)
            .get();
        if (!v) {
            return null;
        }
        let venues = snapshotToArrayData(v);
        if (venues.length !== 1) {
            return null;
        }

        let vItem = VenueAPI.objectfy(venues[0]);

        VenuesMap[venuekey] = vItem;
        return vItem;
    },

    getVenuesByMetroQueryConstruct: (metroname, onlineOnly = true) => {
        let query = VenueAPI.getVenuesByMetroAllQueryConstruct(metroname);
        queury = query.where("withOnlineReservation", "==", onlineOnly)
        return query;
    },

    getVenuesByMetroAllQueryConstruct: (metroname) => {
        let metro = MetroAPI.getMetro(metroname);
        let query = db.collection("venues")
            .where("close", "==", false);

        if (!metro.query) {
            return query.where("metro", "==", metroname);
        }

        metro.query.map(q => {
            if (q.length != 3) {
                throw (`Incorrect metro specification for query, need 3 params ${metroname}`);
            }
            query = query.where(q[0], q[1], q[2]);
        })
        return query;
    },

    getVenuesByMetro: async (metro) => {
        const query = VenueAPI.getVenuesByMetroQueryConstruct(metro);
        return await query
            .orderBy("name")
            .get().then((querySnapshot) => {
                return snapshotToArrayData(querySnapshot);
            });
    },

    getVenuesByMetroAnyStar: async (metro) => {
        const query = VenueAPI.getVenuesByMetroQueryConstruct(metro);
        return await query
            .where("stars", "in", ["1", "2", "3"])
            .orderBy("name")
            .get().then((querySnapshot) => {
                return snapshotToArrayData(querySnapshot);
            });
    },

    getVenuesByMetroByStar: async (metro, star) => {
        const query = VenueAPI.getVenuesByMetroQueryConstruct(metro);
        return await query
            .where("stars", "==", star)
            .orderBy("name")
            .get().then((querySnapshot) => {
                return snapshotToArrayData(querySnapshot);
            });
    },

    getLocalAreaVenuesByMetro: async (metro, localarea) => {
        const query = VenueAPI.getVenuesByMetroQueryConstruct(metro, false);
        return await query
            .where("localarea", "==", localarea)
            .orderBy("name")
            .get().then((querySnapshot) => {
                return snapshotToArrayData(querySnapshot);
            });
    },

    getNoOnlineReservation: async (metro, localarea) => {
        return await db.collection("venues")
            .where("metro", "==", metro)
            .where("withOnlineReservation", "==", false)
            .where("close", "==", false)
            .orderBy("name")
            .get().then((querySnapshot) => {
                return snapshotToArrayData(querySnapshot);
            });
    }
}





exports.VenueAPI = VenueAPI;