import dayjs from 'dayjs';
import { atom } from 'recoil';

export const SelectedDateState = atom({
  key: "selectedDate",
  default: dayjs().format("YYYY-MM-DD"), // default value (aka initial value)
});
