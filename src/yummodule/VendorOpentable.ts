import { VendorBase } from './VendorBase';

export class VendorOpentable extends VendorBase {

    vendorID() {
        return "opentable";
    }

    requiedFieldsForReservation() {
        return ["businessid"];
    }
}