import { VendorBase } from './VendorBase';


export class VendorYelp extends VendorBase {
    vendorID() {
        return "yelp";
    }

    requiedFieldsForReservation() {
        return ["businessid", "url_slug", "longitude", "latitude"];
    }

}