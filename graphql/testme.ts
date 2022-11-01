import { VendorOpentable } from './yummodule/VendorOpentable';

async function testme() {

    // let vendor = new VendorOpentable();
    // let venue = {
    //     businessid: "1234",
    //     timezone: "America/Los_Angeles"
    // };
    // let date = "2021-07-29";
    // let party_size = 2;
    // let timeOption = "dinner";
    // let slots = await vendor.venueSearch(venue, date, party_size, timeOption);
    // console.log(slots);

    let token = await VendorOpentable.fetchAuthToken();
    console.log(token);

    token = await VendorOpentable.fetchAuthToken();
    console.log(token);

}

testme().then(() => {
    // console.log("done");
});
