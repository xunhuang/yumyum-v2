import { VendorBase } from './VendorBase';

export class VendorTock extends VendorBase {
    vendorID() {
        return "tock";
    }
    requiedFieldsForReservation() {
        return ["businessid", "url_slug"];
    }

};