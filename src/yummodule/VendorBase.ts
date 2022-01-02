
export interface TimeSlots {
    time: string;
}

export interface VenueVendorInfo {
    reservation: string;
    name: string;
    key: string;
    businessid?: string;
    businessgroupid?: string;
    timezone?: string;
    resy_city_code?: string;
    url_slug?: string;
    latitude?: string;
    bookingnotes?: string;
    longitude?: string;
}

export interface VenueReservationInfo {
    businessid?: string;
    urlSlug?: string;
    resyCityCode?: string;
}

export class VendorBase {

    vendorID() {
        throw (new Error("VendorID() not implemented."));
    }

    async venueSearchSafe(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<Array<TimeSlots> | null> {
        try {
            console.log(`${venue.reservation} searching for ${venue.name} (${venue.key}) ${date} ${party_size} ${timeOption}`);
            if (!this.allRequiredFieldsPresent(venue)) {
                throw new Error(`Some required fields are missing for ${venue.name} (${venue.key})`)
            }
            return await this.venueSearch(venue, date, party_size, timeOption);
        } catch (err) {
            console.error(`${venue.reservation} Error searching for ${venue.name} (${venue.key}) ${err}`);
            return null;
        }
    }

    allRequiredFieldsPresent(venue: VenueReservationInfo): boolean {
        const required_fields = this.requiedFieldsForReservation;
        for (let f in required_fields) {
            if (!(f in venue)) {
                return false;
            }
        }
        return true;
    }

    async venueSearch(venue: any, date: string, party_size: number, timeOption: string): Promise<Array<TimeSlots> | null> {
        return null;
    }

    getReservationUrl(venue: any, date: string, party_size: number, timeOption: string): string | null {
        return null;
    }

    requiedFieldsForReservation(): Array<string> {
        throw new Error("requiedFieldsForReservation not implemented");
    }

    async fetchReservationInfoFromURL(url: string): Promise<VenueReservationInfo | null> {
        throw new Error("fetchReservationInfoFromURL() not implemented");
    }

    /*
    async fetchVenueInfoFromURL(url) {
        return null;
    }

    assemble_good_search_result(item) {
        let ret = {
            reservation: this.vendorID(),
            withOnlineReservation: true,
        }

        let fields = this.requiedFieldsForReservation();
        fields.map(f => {
            if (!item[f]) {
                throw (`result doesn't have  required field "${f}" `);
            }
            ret[f] = item[f];
        });
        return ret;
    }

    async entitySearch(venue, longitude, latitude, venueurl) {
        let term = venue.name;
        let results = await this.vendor_entity_search(term, longitude, latitude);
        if (results) {
            console.log(results);
            for (var index = 0; index < results.length; index++) {
                let item = results[index];
                if (item) {
                    if (item.latitude && item.longitude && longitude && latitude) {
                        let matched = YumUtil.gpsMatch(
                            { latitude: latitude, longitude: longitude },
                            { latitude: item.latitude, longitude: item.longitude }
                        )
                        if (matched) {
                            return this.assemble_good_search_result(item);
                        }
                    }
                }
            }

            for (var index = 0; index < 5 && index < results.length; index++) {
                let item = results[index];
                if (item) {
                    let info = await this.fetchVenueInfoFromSearchItem(item);
                    if (info) {
                        Object.assign(item, info);// merge new info into item if any
                        if (info.latitude && info.longitude) {
                            let matched = YumUtil.gpsMatch(
                                { latitude: latitude, longitude: longitude },
                                { latitude: info.latitude, longitude: info.longitude }
                            )
                            if (matched) {
                                return this.assemble_good_search_result(item);
                            }
                        }
                        if (venue.realurl) {
                            if (info.realurl) {
                                if (YumUtil.doesTwoUrlsMatch(info.realurl, venue.realurl)) {
                                    return this.assemble_good_search_result(item);
                                }
                            }
                        }

                    }
                }
            }
        }
        return null;
    }

    async fetchVenueInfoFromSearchItem(item) {
        return null;
    }

    bankingNoteHint() {
        return null;
    }

    getReservationUrl(venue, date, parties, timeOption, slot) {
        return null;
    }

    getReservationUrlAction(venue, date, parties, timeOption, slot) {
        return {
            method: "get",
            url: this.getReservationUrl(venue, date, parties, timeOption, slot),
        }
    }
    */
};

