import superagent from 'superagent';

// import { Coordinate } from 'recharts/types/util/types';
const firebaseConfig = {
  apiKey: "aaa",
  // ipdataco_key: "a",
  // ipdataco_key2: "a",
  // ipdataco_key3: "a",
  // ipgeolocation_key: "adds",
  ipgeolocation_key: "f848174315a34d77a99a74286e572020",
  ipdataco_key: "1925a1c9beeffb314056a37b6b2dba3a44ea381dad581cc01647f9f0",
  ipdataco_key2: "fde5c5229bc2f57db71114590baaf58ce032876915321889a66cec61",
  ipdataco_key3: "d199a6d970b84d8e3bf87ae9b9407189c0be507e8ba22db8e459135b",
};

interface CoordType {
  longitude?: number;
  latitude?: number;
  country_name?: string;
  state?: string;
  county?: string;
  county_fips_code?: string;
  stateName?: string;
}

const defaultValue = {
  location: {
    state: "CA",
    county: "Santa Clara",
  },
  coordinates: {
    longitude: -121.8907,
    latitude: 37.3337,
  },
};

// Gets user's country, and if in US and availble, their county/state
export async function fetchPrecisePoliticalLocation() {
  const location = await fetchLocationUsingMethods([
    () => askForExactLocation(),
    () => fetchApproxIPLocationGoogle(),
  ]);
  return location;
}

// Uses IP address to get country, and if availble, approximate country/state
export async function fetchApproximatePoliticalLocation() {
  const location = await fetchLocationUsingMethods([
    () => fetchApproxIPLocationIPDataCo(firebaseConfig.ipdataco_key),
    () => fetchApproxIPLocationIPDataCo(firebaseConfig.ipdataco_key2),
    () => fetchApproxIPLocationIPDataCo(firebaseConfig.ipdataco_key3),
    // () => fetchApproxIPLocationIPGEOLOCATION(),// no more trial, returning texas
    () => fetchApproxIPLocationGoogle(),
  ]);

  return location;
}

type MethodType = () => Promise<CoordType>;

async function fetchLocationUsingMethods(
  methods: MethodType[]
): Promise<CoordType> {
  const safeMethods = methods.concat([() => coordinateFindingError()]);

  let coords: CoordType | null;
  for (const method of safeMethods) {
    try {
      coords = await method();
      break;
    } catch (err) {
      continue;
    }
  }
  return await getPoliticalLocationFromCoordinates(coords!);
}

async function getPoliticalLocationFromCoordinates(
  coordinates: CoordType
): Promise<CoordType> {
  for (const method of [
    () => getCensusLocationFromCoordinates(coordinates),
    // () => getGlobalLocationFromCoordinates(coordinates, firebaseConfig.apiKey),
    () => locationFindingError(),
  ]) {
    const result = await method();
    if (result) {
      return result;
    }
  }
  throw new Error("not possible, we have a fall back location");
}

async function getCensusLocationFromCoordinates(coordinates: CoordType) {
  return await superagent
    .get("https://geo.fcc.gov/api/census/area")
    .query({
      lat: coordinates.latitude,
      lon: coordinates.longitude,
      format: "json",
    })
    .then((res) => {
      console.log(res.body);
      const c = res.body.results[0].county_name;
      const s = res.body.results[0].state_code;
      const stateName = res.body.results[0].state_name;
      console.log("CensusCountyLookupSuccess", {
        location: coordinates,
        // country: Countries.US,
        county: c,
        state: s,
        stateName: stateName,
      });
      return {
        // country: Countries.US,
        county: c,
        state: s,
        stateName: stateName,
        county_fips_code: res.body.results[0].county_fips,
        state_fips_code: res.body.results[0].state_fips,
      };
    })
    .catch((err) => {
      console.log("CensusCountyLookupFailed", coordinates);
      return null;
    });
}

/*
async function getGlobalLocationFromCoordinates(
  coordinates: CoordType,
  apiKey: string
) {
  // some providers have countries already set.
  if (coordinates.country_name) {
    return {
      country: coordinates.country_name,
    };
  }

  const googleMapsEndpoint =
    `https://maps.googleapis.com/maps/api/geocode/json` +
    `?latlng=${coordinates.latitude},${coordinates.longitude}` +
    `&result_type=country` +
    `&key=${apiKey}`;
  return await superagent
    .get(googleMapsEndpoint)
    .then((res) => {
      const results = res.body.results;
      if (!results || results.length < 1) {
        return null;
      }
      const address_components = results[0].address_components;
      if (!address_components || address_components.length < 1) {
        return null;
      }
      const countryName = address_components[0].long_name;
      console.log(results);
      return {
        country: countryName,
      };
    })
    .catch((err) => {
      console.log("GoogleMapsPoliticalLocationLookupFailed", coordinates);
      return null;
    });
}
*/

function locationFindingError() {
  console.log("LocationFromCoordNotFoundAfterAPI");
  return defaultValue.location;
}

function askForExactLocation(): Promise<CoordType> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(error)
    );
  });
}

async function fetchApproxIPLocationGoogle(): Promise<CoordType> {
  return await superagent
    .post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${firebaseConfig.apiKey}`
    )
    .then((res) => {
      console.log(res);
      return {
        longitude: res.body.location.lng,
        latitude: res.body.location.lat,
      };
    });
}

// this one is not very good - while at Alameda, it says it's in santa clara, I guess
// with google we are paying for precision.

/*
async function fetchApproxIPLocationIPGEOLOCATION(): Promise<CoordType> {
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${firebaseConfig.ipgeolocation_key}`;
  return await superagent.get(url).then((res) => {
    if (!res.body.longitude) {
      throw new Error("Bad result");
    }
    console.log("ipgeolocation");
    console.log(res.body);
    return {
      longitude: res.body.longitude,
      latitude: res.body.latitude,
      country_code: res.body.country_code2,
      country_name: res.body.country_name,
      region: res.body.state_prov,
      region_code: res.body.region_code,
    };
  });
}
*/

async function fetchApproxIPLocationIPDataCo(
  apikey: string
): Promise<CoordType> {
  const url = `https://api.ipdata.co/?api-key=${apikey}`;
  return await superagent.get(url).then((res) => {
    if (!res.body || !res.body.longitude) {
      throw new Error("Bad result");
    }
    console.log("ipgdata");
    console.log(res.body);
    return {
      longitude: res.body.longitude,
      latitude: res.body.latitude,
      country_code: res.body.country_code,
      country_name: res.body.country_name,
      region: res.body.region,
      region_code: res.body.region_code,
    };
  });
}

async function coordinateFindingError(): Promise<CoordType> {
  console.log("LocationNoFoundAfterAPI");
  return defaultValue.coordinates;
}
