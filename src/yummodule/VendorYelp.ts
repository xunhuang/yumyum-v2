import { VendorBase, VenueVendorInfo } from './VendorBase';

const buildUrl = require('build-url');

export class VendorYelp extends VendorBase {
    vendorID() {
        return "yelp";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "longitude", "latitude"];
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://www.yelp.com/reservations/${venue.url_slug}`;
        let reservationUrl = buildUrl(url, {
            queryParams: {
                date: date,
                covers: party_size,
                from_reserve_now: 1,
                time: (timeOption === "dinner") ? 1900 : 1200,
            }
        });
        return reservationUrl;
    }

}