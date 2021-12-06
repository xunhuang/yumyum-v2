// const getDistance = require('geolib').getDistance;

// function urlPathParts(url: string, position: number) {
//     let path = urlparse.parse(url).path;
//     var path_parts = path.split("/");
//     return path_parts[position];
// }

// function doesTwoUrlsMatch(one: string, two: string) {
//     let onehost = urlparse.parse(normalizeUrl(one)).hostname;
//     let twohost = urlparse.parse(normalizeUrl(two)).hostname;

//     if (!onehost.startsWith("www.")) {
//         onehost = "www." + onehost;
//     }
//     if (!twohost.startsWith("www.")) {
//         twohost = "www." + twohost;
//     }

//     return onehost === twohost;
// }

function doesNameMatch(name1: string, name2: string) {
    return name1.toLowerCase().trim() === name2.toLowerCase().trim();
}

export function normalizeUrl(url: string) {
    if (!url.includes("http")) {
        return "http://" + url;
    }
    return url;
}

// unit in Meters
// function gpsMatch(a, b, bound = 300) {
//     if (a.latitude === null || a.longitude === null || b.latitude === null || b.longitude === null) {
//         return false;
//     }
//     let d = getDistance(
//         { latitude: a.latitude, longitude: a.longitude },
//         { latitude: b.latitude, longitude: b.longitude }
//     );
//     return (d < bound);
// }

// const YumUtil = {
//     // gpsMatch,
//     normalizeUrl,
//     doesTwoUrlsMatch,
//     doesNameMatch,
//     urlPathParts,
// }
