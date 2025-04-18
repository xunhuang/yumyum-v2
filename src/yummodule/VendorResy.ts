
import {
  VendorBase,
} from "./VendorBase";


export class VendorResy extends VendorBase {
  vendorID() {
    return "resy";
  }

  requiedFieldsForReservation() {
    return ["businessid", "url_slug", "resy_city_code"];
  }

}
