import Cookies from 'js-cookie';

const LastUserSelectionCookieName = "LAST_USER_SELECTION";

interface LastUserSelection {
    date: string;
    party_size: number;
    timeOption: string;
}

export function getLastUserSelection(): null | LastUserSelection {
    const cache = Cookies.get(LastUserSelectionCookieName);
    if (cache == null) return null;
    return JSON.parse(cache) as LastUserSelection;
}

export function setLastUserSelection(last: LastUserSelection) {
    console.log("settting cookie");
    Cookies.set(LastUserSelectionCookieName, JSON.stringify(last), { expires: 1 });
}