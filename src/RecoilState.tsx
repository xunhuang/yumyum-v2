import { atom } from 'recoil';

export const LastUpdatedState = atom({
  key: "lastUpdated", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
