import { TimeSlots, VendorBase, VenueVendorInfo } from './VendorBase';
import { sevenrooms_find_reservation } from '../yumutil';

export class VendorSevenrooms extends VendorBase {
    vendorID() {
        return "sevenrooms";
    }
    requiedFieldsForReservation() {
        return ["url_slug"];
    }

    async venueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<TimeSlots[]> {
        return await sevenrooms_find_reservation(venue.url_slug!, date, party_size, timeOption, venue.timezone!);
    }

    getReservationUrl(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): string | null {
        let url = `https://www.sevenrooms.com/reservations/${venue.url_slug}`;
        // SAD: there is no date/party link here... :(
        return url;
    }
}
