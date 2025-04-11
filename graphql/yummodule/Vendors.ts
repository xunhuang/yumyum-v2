import { VendorBase } from "./VendorBase";
import { VendorOpentable } from "./VendorOpentable";
import { VendorResy } from "./VendorResy";
import { VendorSevenrooms } from "./VendorSevenrooms";
import { VendorTock } from "./VendorTock";
import { VendorYelp } from "./VendorYelp";

type tplotOptions = {
  [key: string]: VendorBase;
};

export const VendorMap: tplotOptions = {
  opentable: new VendorOpentable(),
  resy: new VendorResy(),
  tock: new VendorTock(),
  sevenrooms: new VendorSevenrooms(),
  yelp: new VendorYelp(),
};

export const getVendor = (type: string): VendorBase => {
  return VendorMap[type];
};
