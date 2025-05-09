import { describe } from "@jest/globals";
import dayjs from "dayjs";

import { VendorTock } from "../graphql/yummodule/VendorTock";
import {
  venueToVendorInfo,
  yumyumVenueByKey,
} from "./getYumYumGraphQLClient";

var tock = new VendorTock();

describe("Tock System Test", () => {
  // this one has a strange communal flag...
  it("investigate Osito", async () => {
    const result = await yumyumVenueByKey("4vC2zTU1hBOBNnyyEReU4");
    const search_result = await tock.venueSearchSafe(
      venueToVendorInfo(result?.data?.venueByKey!),
      dayjs().add(7, "day").format("YYYY-MM-DD"),
      2,
      "dinner",
      true
    );
    expect(search_result).not.toBeNull();
  });
});
