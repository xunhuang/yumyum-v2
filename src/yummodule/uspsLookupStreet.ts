const USPS = require('usps-webtools');

const usps = new USPS({
  server: 'http://production.shippingapis.com/ShippingAPI.dll',
  userId: '638XUNHU2733',
  ttl: 10000 //TTL in milliseconds for request
});
export async function uspsLookupStreet(street1: string, city: string, state: string): Promise<any> {
  return new Promise((resolve, reject) => {

    let fixedState = state;
    if (fixedState === 'New York State') {
      fixedState = 'NY';
    }

    usps.verify({
      street1: street1,
      // street2: 'Apt 2',
      city: city,
      state: fixedState,
    }, function (err: any, address: any) {

      // if (!address?.street1) {
      //   console.log("uspsLookupStreet: no address found for " + street1 + ", " + city + ", " + fixedState);
      // }

      resolve(address?.street1);
    });

  });
}
