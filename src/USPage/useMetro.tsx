import { useLocation } from 'react-router';
import { atom, useRecoilState } from 'recoil';

import { useIPLocation } from './CookieGeoLocation';
import { MetroDefiniton } from '../yummodule/metro_def';

const getDistance = require("geolib").getDistance;

export const useGuessMetroByIP = () => {
  const iplocation = useIPLocation();
  if (iplocation === null) {
    return "bayarea"; // default metro;
  }

  let allmetros = MetroDefiniton.map((metro) => {
    return {
      key: metro.key,
      distance: getDistance(
        { latitude: metro.latitude, longitude: metro.longitude },
        { latitude: iplocation.latitude, longitude: iplocation.longitude }
      ),
    };
  });
  allmetros = allmetros.sort((a: any, b: any) => a.distance - b.distance);
  return allmetros[0].key;
};

export const MetroState = atom({
  key: "selectedMetro",
  default: "",
});

export const useMetro = () => {
  const location = useLocation();
  const path = location.pathname;
  const iplocation = useGuessMetroByIP();
  const [metro, setMetro] = useRecoilState(MetroState);

  if (metro !== "") {
    return metro;
  }

  if (path && path.startsWith("/metro/")) {
    var parts = path.split("/");
    const newmetro = parts[2];
    setMetro(newmetro);
    return newmetro;
  }

  setMetro(iplocation);
  return iplocation;
};

export const useMetroFromPath = () => {
  const location = useLocation();
  const path = location.pathname;
  const [metro, setMetro] = useRecoilState(MetroState);

  if (path && path.startsWith("/metro/")) {
    var parts = path.split("/");
    const newmetro = parts[2];
    setMetro(newmetro);
    return newmetro;
  }
  return metro;
};