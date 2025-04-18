import { describe, expect } from "@jest/globals";
import {
  browserPageShutdown,
  tockFindCalendarForVenue,
  tock_basic_search,
  tock_basic_search_and_validate,
  tock_fetch_app_config,
  venueNameSimilar,
} from "../src";

const Ssal_TestCase = {
  name: "Ssal",
  urlSlug: "ssal",
  businessid: "19093",
  longitude: -122.4219651,
  latitude: 37.7972584,
  address: "2226 Polk St.",
  city: "San Francisco",
  region: "California",
};

const TheWild_TestCase = {
  name: "The Wild",
  urlSlug: "thewild",
  businessid: "7656",
  longitude: -122.3921198,
  latitude: 37.7911695,
  // address: "1198 Howard St",
  address: "",
  city: "San Francisco",
  region: "California",
};
const sevendeloreis_testcase = {
  name: "Seventh & Dolores",
  urlSlug: "sevendeloreis",
  businessid: "7656",
  longitude: -121.92262,
  latitude: 36.55362,
  address: "7th Ave. & Dolores St.",
  city: "Carmel-by-the-Sea",
  region: "California",
};

const testcase = Ssal_TestCase;

describe("tock base API", () => {
  it("tock_fetch_app_config", async () => {
    const data = testcase;
    const appConfig = await tock_fetch_app_config(data.urlSlug);
    expect(appConfig?.app?.config?.business).toBeDefined();
    expect(
      venueNameSimilar(appConfig?.app?.config?.business?.name, data.name)
    ).toBe(true);
  }, 10000);

  it("tock_calendar", async () => {
    const data = testcase;
    const tock_result = await tockFindCalendarForVenue(data.urlSlug);
    expect(tock_result).toBeDefined();
    expect(tock_result).not.toBeNull();
    expect(() => JSON.parse(tock_result as string)).not.toThrow();
  }, 10000);

  it("tock_calendar_bad_slug", async () => {
    const bad_result = await tockFindCalendarForVenue("badslug");
    expect(bad_result).toBeUndefined();
  }, 15000);

  it("tock_calendar_juni", async () => {
    const result = await tockFindCalendarForVenue("juni");
  }, 15000);

  afterAll(async () => {
    await browserPageShutdown();
  });
});

describe("tock search API", () => {
  it("tock_basic_entity_search_return_candidates", async () => {
    const data = testcase;
    const search_results = await tock_basic_search(
      data.name,
      data.longitude,
      data.latitude
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
    await browserPageShutdown();
  });
});
