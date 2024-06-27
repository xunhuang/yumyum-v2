import { describe, expect } from "@jest/globals";
import dayjs from "dayjs";
import {
  newFindReservation,
  resy_basic_search_and_validate,
  yumyumGraphQLCall,
} from "../src";

const heirloomCafe = {
  name: "Heirloom Cafe",
  city: "San Francisco",
  address: "2500 Folsom St",
  latitude: 37.757116,
  longitude: -122.414713,
  state: "CA",
  // to be returned from search
  businessid: "7074",
  urlSlug: "heirloom-cafe",
  resyCityCode: "sf",
};

describe("resy", () => {
  it("resy basic search heirloom cafe", async () => {
    const data = heirloomCafe;

    const result = await resy_basic_search_and_validate(
      data.name,
      data.longitude,
      data.latitude,
      data.address
    );

    expect(result).not.toBeNull();
    expect(result.name).toBe(data.name);
    expect(result.businessid).toBe(data.businessid);
    expect(result.urlSlug).toBe(data.urlSlug);
    expect(result.resyCityCode).toBe(data.resyCityCode);
  });

  it("resy basic search guesthouse", async () => {
    const data = {
      name: "Guesthouse",
      urlSlug: "guesthouse",
      businessid: "53689",
      key: "49780d75-349f-4fbb-8e74-a5012fdee24d",
      longitude: -122.5483542,
      latitude: 37.9545644,
      region: "California",
      address: "850 College Ave.",
      resyCityCode: "mrn",
    };

    const result = await resy_basic_search_and_validate(
      data.name,
      data.longitude,
      data.latitude,
      data.address
    );
    expect(result).not.toBeNull();
    expect(result.name).toBe(data.name);
    expect(result.businessid).toBe(data.businessid);
    expect(result.urlSlug).toBe(data.urlSlug);
    expect(result.resyCityCode).toBe(data.resyCityCode);
  });
  it("resy API - find reservation", async () => {
    const data = heirloomCafe;

    const result = await newFindReservation(
      data.businessid,
      dayjs().add(1, "day").format("YYYY-MM-DD"),
      2
    );

    expect(result).not.toBeNull();
    expect(result.results?.venues?.length).not.toBeNull();
  });
});
