import { describe, expect } from "@jest/globals";
import { resy_basic_search_and_validate, yumyumGraphQLCall } from "yumutil";

describe("resy", () => {
  // it("resy basic search", async () => {
  //   const data = {
  //     name: "Heirloom Cafe",
  //     city: "San Francisco",
  //     address: "2500 Folsom St",
  //     latitude: 37.757116,
  //     longitude: -122.414713,
  //     state: "CA",
  //     // to be returned from search 
  //     businessid: '7074',
  //     urlSlug: 'heirloom-cafe',
  //     resyCityCode: 'sf'
  //   };

  //   const result = await resy_basic_search_and_validate(data.name,
  //     data.longitude, data.latitude, data.address);

  //   expect(result).not.toBeNull();
  //   expect(result.name).toBe(data.name);
  //   expect(result.businessid).toBe(data.businessid);
  //   expect(result.urlSlug).toBe(data.urlSlug);
  //   expect(result.resyCityCode).toBe(data.resyCityCode);
  // });

  it("resy basic search marlena", async () => {
    // const data = {
    //   "name": "Marlena",
    //   "urlSlug": "marlena",
    //   "businessid": "35007",
    //   "key": "407fbd33-2acc-4e60-9f21-2086c066237c",
    //   "longitude": -122.4134486,
    //   "latitude": 37.7467485,
    //   "region": "California",
    //   "address": "300 Precita Ave.",
    //   "resyCityCode": "sf"
    // };
    const data = {
      name: "Guesthouse",
      urlSlug: "guesthouse",
      businessid: "53689",
      key: "49780d75-349f-4fbb-8e74-a5012fdee24d",
      longitude: -122.5483542,
      latitude: 37.9545644,
      region: "California",
      address: "850 College Ave.",
      resyCityCode: "mrn"
    }

    const result = await resy_basic_search_and_validate(data.name,
      data.longitude, data.latitude, data.address);
    expect(result).not.toBeNull();
    expect(result.name).toBe(data.name);
    expect(result.businessid).toBe(data.businessid);
    expect(result.urlSlug).toBe(data.urlSlug);
    expect(result.resyCityCode).toBe(data.resyCityCode);

  });
});
