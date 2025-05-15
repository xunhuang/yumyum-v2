
export const VendorRequiredFields: Record<string, Array<string>> = {
  opentable: ["businessid"],
  resy: ["businessid", "url_slug", "resy_city_code"],
  tock: ["businessid", "url_slug"],
  sevenrooms: ["url_slug"],
  yelp: ["businessid", "url_slug"],
};

export const getVendorRequiredFields = (reservation: string): Array<string> => {
  const vendor = VendorRequiredFields[reservation];
  if (!vendor) {
    return [];
  }
  console.log(vendor);
  return vendor;
}
