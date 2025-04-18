import { describe, expect } from "@jest/globals";
// import dayjs from "dayjs";
import {
  GoogleFindPlaceFromText,
  GoogleFindStreetAddressFromText,
} from "../src";

describe("Google API test", () => {
  it("google_find_place_from_text", async () => {
    const result = await GoogleFindPlaceFromText("trabocco Alameda CA");
    expect(result).not.toBeNull();
  });

  it("google_find_street_address_from_text", async () => {
    const result = await GoogleFindStreetAddressFromText("trabocco Alameda CA");
    expect(result).not.toBeNull();
    expect(result).toContain("2213 S Shore Center");
  });
});
