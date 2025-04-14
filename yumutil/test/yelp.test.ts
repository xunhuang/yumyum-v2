import { describe, expect } from "@jest/globals";
// import dayjs from "dayjs";
import {
  yelp_basic_search,
} from "../src";

describe("resy", () => {
  it("resy basic search heirloom cafe", async () => {
    const result = await yelp_basic_search(
      "trabocco",
      "Alameda",
      "CA"
    );

    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain("Trabocco");
  });

});
