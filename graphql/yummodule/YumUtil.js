const buildUrl = require('build-url');
const moment = require('moment-timezone');
const getDistance = require('geolib').getDistance;
const urlparse = require('url');

function urlPathParts(url, position) {
    let path = urlparse.parse(url).path;
    var path_parts = path.split("/");
    return path_parts[position];
}

function doesTwoUrlsMatch(one, two) {
    let onehost = urlparse.parse(normalizeUrl(one)).hostname;
    let twohost = urlparse.parse(normalizeUrl(two)).hostname;

    if (!onehost.startsWith("www.")) {
        onehost = "www." + onehost;
    }
    if (!twohost.startsWith("www.")) {
        twohost = "www." + twohost;
    }

    return onehost === twohost;
}

function doesNameMatch(name1, name2) {
    return name1.toLowerCase().trim() === name2.toLowerCase().trim();
}

function normalizeUrl(url) {
    if (!url.includes("http")) {
        return "http://" + url;
    }
    return url;
}
function snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function (childSnapshot) {
        returnArr.push(childSnapshot);
    });
    return returnArr;
}

function snapshotToArrayData(snapshot) {
    var returnArr = []
    snapshot.forEach(function (childSnapshot) {
        returnArr.push(childSnapshot.data());
    });
    return returnArr;
}

// unit in Meters
function gpsMatch(a, b, bound = 300) {
    if (a.latitude === null || a.longitude === null || b.latitude === null || b.longitude === null) {
        return false;
    }
    let d = getDistance(
        { latitude: a.latitude, longitude: a.longitude },
        { latitude: b.latitude, longitude: b.longitude }
    );
    return (d < bound);
}

const YumUtil = {
    snapshotToArray,
    snapshotToArrayData,
    gpsMatch,
    normalizeUrl,
    doesTwoUrlsMatch,
    doesNameMatch,
    urlPathParts,
}

exports.YumUtil = YumUtil;