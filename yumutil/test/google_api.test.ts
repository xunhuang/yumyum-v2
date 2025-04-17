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

  it("google_find_street_address_from_text_2", async () => {
    const result = await GoogleFindStreetAddressFromText(
      "Seventh & Dolores, Carmel-by-the-Sea, CA"
    );
    // const result = await GoogleFindStreetAddressFromText(
    //   "Seventh and Dolores Steakhouse, Carmel-by-the-Sea, CA"
    // );
    expect(result).not.toBeNull();
    expect(result).toContain("Dolores St & 7th Ave");
  });
});
