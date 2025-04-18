import { describe, expect } from "@jest/globals";
import {
  sevenrooms_find_reservation,
} from "../src";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

describe("Sevenrooms", () => {
  // it("yelp_basic_search", async () => {
  //   const result = await yelp_basic_search("trabocco", "Alameda", "CA");

  //   expect(result).not.toBeNull();
  //   expect(result.length).toBeGreaterThan(0);
  //   expect(result[0].name).toContain("Trabocco");
  // }, 10000);

  // it("getYelpBusinessDetails", async () => {
  //   const result = await getYelpBusinessDetails(
  //     "trabocco-kitchen-and-cocktails-alameda"
  //   );
  //   expect(result).not.toBeNull();
  //   expect(result.name).toContain("Trabocco");
  // });

  const data2 = {
    "name": "Farmstead",
    "urlSlug": "farmstead",
    "timezone": "America/Los_Angeles",
  };

  it("yelp_find_reservation", async () => {
    const date = dayjs().add(7, "days").format("YYYY-MM-DD");
    const result = await sevenrooms_find_reservation(
      data2.urlSlug,
      date,
      2,
      "dinner",
      data2.timezone
    );
    console.log(result);
    expect(result).not.toBeNull();
  });

  // it("yelp_basic_search_and_validate", async () => {
  //   const result = await yelp_basic_search_and_validate(
  //     data2.name,
  //     data2.longitude,
  //     data2.latitude,
  //     data2.address,
  //     data2.city,
  //     data2.region
  //   );
  //   expect(result).not.toBeNull();
  //   expect(result.name).toContain(data2.name);
  //   expect(result.slug).toContain(data2.slug);
  //   expect(result.businessid).toContain(data2.businessid);
  // }, 10000);

  // const data = {
  //   name: "Trabocco",
  //   address: "2213 South Shore Center",
  //   city: "Alameda",
  //   region: "California",
  //   longitude: -122.254532,
  //   latitude: 37.756708,
  // };

  // it("yelp_basic_search_and_validate_should_not_find_as_not_on_yelp", async () => {
  //   const result = await yelp_basic_search_and_validate(
  //     data.name,
  //     data.longitude,
  //     data.latitude,
  //     data.address,
  //     data.city,
  //     data.region
  //   );
  //   expect(result).not.toBeDefined();
  // }, 10000);
});
