import { describe, expect } from "@jest/globals";
import dayjs from "dayjs";
import {
  opentableFindReservation,
  opentable_basic_search,
  opentable_basic_search_and_validate,
  opentable_fetchAuthToken,
  opentable_fetchAppConfig,
  opentable_fetchPrimaryWindowVars,
  opentable_fetchCSRFToken,
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
  it("opentable_get_auth_token", async () => {
    const token = await opentable_fetchAuthToken();
    expect(token).toBeDefined();
    expect(token).not.toBeNull();
  });
  it("opentable_fetch_app_config", async () => {
    const appConfig = await opentable_fetchAppConfig(testcase.businessid);
    expect(appConfig).toBeDefined();
    expect(appConfig).not.toBeNull();
  });
  it("opentable_fetch_primary_window_vars", async () => {
    const primaryWindowVars = await opentable_fetchPrimaryWindowVars(
      testcase.businessid
    );
    expect(primaryWindowVars).toBeDefined();
    expect(primaryWindowVars).not.toBeNull();
  });
  it("opentable_fetch_csrf_token", async () => {
    const csrfToken = await opentable_fetchCSRFToken();
    expect(csrfToken).toBeDefined();
    expect(csrfToken).not.toBeNull();
  });
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
