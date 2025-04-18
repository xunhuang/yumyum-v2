const { getVendor } = require("./Vendors")
const { snapshotToArrayData } = require('./YumUtil.js').YumUtil;


class VenueClass {
    getReservationURL(datestr, party_size, timeOption = "dinner", slot) {
        let vendor = getVendor(this.reservation);
        if (vendor) {
            return vendor.getReservationUrl(this, datestr, party_size, timeOption, slot);
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
        query = query.where("withOnlineReservation", "==", onlineOnly)
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