import { VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');

export class VendorTock extends VendorBase {
    vendorID() {
        return "tock";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let baseurl = `https://www.exploretock.com/${venue.url_slug}/search`;

        let reservationUrl = buildUrl(baseurl, {
            queryParams: {
                date: date,
                size: party_size,
                time: (timeOption === "dinner") ? "19:00" : "12:00",
            }
        });
        return reservationUrl;
    }


};