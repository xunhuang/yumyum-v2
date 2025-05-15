import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export async function sevenrooms_find_reservation(
  slug: string,
  date: string,
  party_size: number,
  timeOption: string,
  timezone: string,
): Promise<any> {
  const url = "https://www.sevenrooms.com/api-yoa/availability/widget/range";
  const params = new URLSearchParams({
    venue: slug,
    time_slot: (timeOption === "dinner") ? "19:00" : "12:00",
    party_size: party_size.toString(),
    halo_size_interval: "16",
    start_date: date,
    num_days: "3",
    channel: "SEVENROOMS_WIDGET"
  });

  const response = await fetch(`${url}?${params}`);
  const data = await response.json();

  let total: any = [];
  if (!data.data) {
    return [];
  }

  let dateslots = data.data.availability[date];
  if (dateslots) {
    let sections = dateslots;
    sections.forEach((section: any) => {
      let slots = section.times;
      slots.forEach(function (slot: any) {
        if (slot.access_persistent_id) {
          let datestr = dayjs.tz(slot.time_iso, timezone).format();
          total.push({
            time: datestr,
          });
        }
      });
    });
    return total;
  }
  return [];
}
