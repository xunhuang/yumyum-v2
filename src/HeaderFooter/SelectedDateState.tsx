import dayjs from 'dayjs';
import { atom } from 'recoil';

import { getLastUserSelection } from '../USPage/CookieUserSelection';

const cookieState = getLastUserSelection();

export const SelectedDateState = atom({
  key: "selectedDate",
  default: cookieState?.date || dayjs().format("YYYY-MM-DD"), // default value (aka initial value)
});

export const SelectedPartySize = atom({
  key: "selectedPartySize",
  default: cookieState?.party_size || 2,
});

export const SelectedTimeOption = atom({
  key: "selectedTimeOption",
  default: cookieState?.timeOption || "dinner",
  // default: cookieState?.timeOption || "lunch",
});