import { describe, expect } from "@jest/globals";
import dayjs from "dayjs";
import {
  tock_basic_search,
  tock_basic_search_and_validate,
  tock_support_shutdown,
} from "../src";

const testcase = {
  "name": "Ssal",
  "urlSlug": "ssal",
  "businessid": "19093",
  "longitude": -122.4219651,
  "latitude": 37.7972584,
  "address": "2226 Polk St.",
  "city": "San Francisco",
  "region": "California"
};

describe("tock", () => {
  it("tock_basic_entity_search_return_candidates", async () => {
    const data = testcase;
    const search_results = await tock_basic_search(
      data.name,
      data.longitude,
      data.latitude,
    );
    expect(search_results).toBeDefined();
    expect(search_results).not.toBeNull();
    expect(search_results?.length).toBeGreaterThan(0);
  }, 10000);

  it("tock_basic_entity_search_and_validate", async () => {
    const data = testcase;
    const tock_result = await tock_basic_search_and_validate(
      data.name,
      data.longitude,
      data.latitude,
      data.address,
      data.city,
      data.region
    );
    expect(tock_result?.slug).toBe(data.urlSlug);
    expect(tock_result?.businessid.toString()).toBe(data.businessid);
  }, 10000);

  afterAll(async () => {
    await tock_support_shutdown();
  });

  // it("opentable_API_find_reservation", async () => {
  //   const data = testcase;
  //   const date = dayjs().add(1, "day").format("YYYY-MM-DD");

  //   const result = await opentableFindReservation(
  //     data.businessid,
  //     date,
  //     2,
  //     "dinner"
  //   );

  //   expect(result).not.toBeNull();
  //   expect(result.availability).toBeDefined();
  //   expect(result.availability.error).not.toBeDefined();
  //   expect(result.availability[date]).toBeDefined();
  // });
});