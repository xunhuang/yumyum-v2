import { describe, expect } from "@jest/globals";
import dayjs from "dayjs";
import {
  opentableFindReservation,
  opentable_basic_search,
  opentable_basic_search_and_validate,
} from "../src";

const testcase = {
  name: "Doppio Zero Pizzeria Napoletana",
  urlSlug: null,
  key: "ejW4vd4IjEzp2SptHnzx",
  businessid: "110716",
  longitude: -122.0787,
  latitude: 37.394318,
  address: "160 Castro St.",
  city: "Mountain View",
  region: "California",
};

describe("opentable", () => {
  it("opentable_basic_entity_search_return_candidates", async () => {
    const data = testcase;
    const search_results = await opentable_basic_search(
      data.name,
      data.longitude,
      data.latitude
    );
    expect(search_results.length).toBeGreaterThan(0);
  });

  it("opentable_basic_entity_search_and_validate", async () => {
    const data = testcase;
    const opentable_id = await opentable_basic_search_and_validate(
      data.name,
      data.longitude,
      data.latitude,
      data.address
    );
    expect(opentable_id).toBe(data.businessid);
  });

  it("opentable_API_find_reservation", async () => {
    const data = testcase;
    const date = dayjs().add(1, "day").format("YYYY-MM-DD");

    const result = await opentableFindReservation(
      data.businessid,
      date,
      2,
      "dinner"
    );

    expect(result).not.toBeNull();
    expect(result.availability).toBeDefined();
    expect(result.availability.error).not.toBeDefined();
    expect(result.availability[date]).toBeDefined();
  });
});
