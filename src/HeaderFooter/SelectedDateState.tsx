import dayjs from 'dayjs';
import { atom } from 'recoil';

export const SelectedDateState = atom({
  key: "selectedDate",
  default: dayjs().format("YYYY-MM-DD"), // default value (aka initial value)
});

export const SelectedPartySize = atom({
  key: "selectedPartySize",
  default: 2,
});

export const SelectedTimeOption = atom({
  key: "selectedTimeOption",
  default: "dinner",
});