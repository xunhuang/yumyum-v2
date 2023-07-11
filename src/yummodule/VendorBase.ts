import dayjs from 'dayjs';

import { VenueSearchInput } from './VenueSearchInput';

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
    close?: boolean;
}

export interface VenueReservationInfo {
    reservation?: string;
    businessid?: string;
    urlSlug?: string;
    resyCityCode?: string;
    latitude?: string;
    longitude?: string;
}

export class VendorBase {

    vendorID() {
        throw (new Error("VendorID() not implemented."));
    }

    async venueSearchSafe(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string,
        nolog: boolean = false): Promise<Array<TimeSlots> | null> {
        try {
            if (!nolog) {
                console.log(`${venue.reservation} searching for ${venue.name} (${venue.key}) ${date} ${party_size} ${timeOption}`);
            }
            if (!this.allRequiredFieldsPresent(venue)) {
                throw new Error(`Some required fields are missing for ${venue.name} (${venue.key})`)
            }
            let slots = await this.venueSearch(venue, date, party_size, timeOption);
            // not all vendors respect the lunch/dinner options for slots so we have to filter them out here
            if (slots) {
                slots = slots?.filter((slot) => {
                    if (timeOption === "lunch") {
                        return dayjs(slot.time).hour() < 16;

                    }
                    return dayjs(slot.time).hour() >= 16;
                });
            }
            return slots;

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

    async entitySearchExactTerm(term: string, longitude: number, latitude: number, extra: VenueSearchInput): Promise<VenueReservationInfo | null> {
        throw new Error("entitySearchExactTerm() not implemented");
    }
};

