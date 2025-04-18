import { VendorBase } from './VendorBase';

export class VendorSevenrooms extends VendorBase {
    vendorID() {
        return "sevenrooms";
    }
    requiedFieldsForReservation() {
        return ["url_slug"];
    }
}
