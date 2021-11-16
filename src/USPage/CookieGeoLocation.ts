import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import superagent from 'superagent';

const LastUserSelectionCookieName = "LAST_USER_LOCATION";

export interface UserLocation {
    longitude: number;
    latitude: number;
}

function getLastUserSelection(): null | UserLocation {
    const cache = Cookies.get(LastUserSelectionCookieName);
    if (cache == null) return null;
    return JSON.parse(cache) as UserLocation;
}

function setLastUserLocation(last: UserLocation) {
    // location cookie expire every hour.
    Cookies.set(LastUserSelectionCookieName, JSON.stringify(last), { expires: 1 / 24 });
};

export const default_location: UserLocation = {
    longitude: -122.2269125,
    latitude: 37.7310408,
}

export async function fetchApproxIPLocation(): Promise<UserLocation | null> {
    const last = getLastUserSelection();
    if (last) {
        return last;
    }
    let iplocation = await superagent
        .get("https://api.ipdata.co/?api-key=fde5c5229bc2f57db71114590baaf58ce032876915321889a66cec61")
        .then(res => {
            return {
                longitude: res.body.longitude,
                latitude: res.body.latitude,
            }
        })
        .catch(err => {
            return default_location;
        });
    if (iplocation)
        setLastUserLocation(iplocation);
    return iplocation;
}

export function useIPLocation(): UserLocation | null {
    // why not set default location here? we want to at least make one attempt with API
    // before falling back to default.
    const [location, setLocation] = React.useState<UserLocation | null>(null);
    // console.log("location.... ");
    // console.log(location);
    useEffect(() => {
        fetchApproxIPLocation().then((userlocation) => {
            setLocation(userlocation);
        });
    }, []);
    return location;
}