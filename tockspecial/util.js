const USPS = require("usps-webtools");


async function addressMatch(street_a, street_b, city, state) {

  console.log("addressMatch", street_a, street_b, city, state);
  if (!street_a || !street_b) {
    return false;
  }

  street_a = street_a.toLowerCase();
  street_b = street_b.toLowerCase();
  if (street_a === street_b) {
    return true;
  }

  const usps_street_a = await uspsLookupStreet(street_a, city, state);
  const usps_street_b = await uspsLookupStreet(street_b, city, state);

  if (!usps_street_a || !usps_street_b) {
    return false;
  }
  return usps_street_a === usps_street_b;
}
exports.addressMatch = addressMatch;
const usps = new USPS({
  server: "http://production.shippingapis.com/ShippingAPI.dll",
  userId: "638XUNHU2733",
  ttl: 10000, //TTL in milliseconds for request
});

async function uspsLookupStreet(street1, city, state) {
  return new Promise((resolve, reject) => {
    let fixedState = state;
    if (fixedState === "New York State") {
      fixedState = "NY";
    }

    usps.verify(
      {
        street1: street1,
        // street2: 'Apt 2',
        city: city,
        state: fixedState,
      },
      function (err, address) {
        // if (!address?.street1) {
        //   console.log("uspsLookupStreet: no address found for " + street1 + ", " + city + ", " + fixedState);
        // }
        resolve(address?.street1);
      }
    );
  });
}
function venueNameMatched(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a === b;
}
exports.venueNameMatched = venueNameMatched;
