import { describe, expect } from "@jest/globals";
import { sevenrooms_find_reservation } from "../src";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

describe("Sevenrooms", () => {
  const data2 = {
    name: "Farmstead",
    urlSlug: "farmstead",
    timezone: "America/Los_Angeles",
  };

  it("sevenrooms_find_reservation", async () => {
    const date = dayjs().add(7, "days").format("YYYY-MM-DD");
    const result = await sevenrooms_find_reservation(
      data2.urlSlug,
      date,
      2,
      "dinner",
      data2.timezone
    );
    expect(result).not.toBeNull();
  });
});
