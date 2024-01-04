const functions = require('@google-cloud/functions-framework');
const { gotScraping } = require('got-scraping');
const UserAgent = require('user-agents');

const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const venuetimezone = "America/Los_Angeles";

functions.http('tock', async(req, res) => {
    const result = await tock_full(req.query.businessId, req.query.businessGroupId, req.query.venuetimezone, req.query.date, req.query.party_size);
    return res.send(JSON.stringify(result));
});

functions.http('tock_full', async(req, res) => {
    const result = await tock_full(req.query.businessId, req.query.businessGroupId, req.query.venuetimezone, req.query.date, req.query.party_size);
    if (!result.result) {
        console.error(`error, no result for ${req.query.businessId}`);
    }
    return res.send(JSON.stringify(result));
});

functions.http('helloGET', async(req, res) => {

    // paramater are passed as query string like
    // https://us-central1-<project-name>.cloudfunctions.net/helloGET?a=1&b=2
    // console.log(req.query);

    // return await tock_full(req.query.businessId, req.query.businessGroupId, venuetimezone, req.query.date, req.query.party_size);
    const businessId = 19093;
    const businessGroupId = 14253;
    const date = "2024-01-26";
    const party_size = 2;

    const result = await tock_full(businessId, businessGroupId, venuetimezone, date, party_size);
    return res.send(JSON.stringify(result));
});

functions.http('helloGET2', async(req, res) => {
    return res.send("hello world");
});

async function tock_full(businessId, businessGroupId, venuetimezone, date, party_size) {

    const userAgent = new UserAgent({ deviceCategory: 'mobile' })
        // const userAgent = new UserAgent();

    let tock_scope = {
        "businessId": businessId,
        "businessGroupId": businessGroupId,
        "site": "EXPLORETOCK",
    };

    const response = await gotScraping.post({
        // url: 'https://www.exploretock.com/api/consumer/offerings',
        url: "https://www.exploretock.com/api/consumer/calendar/full",
        responseType: 'json',
        headerGeneratorOptions: {
            browsers: [{
                name: 'chrome',
                minVersion: 100,
                maxVersion: 122
            }],
            devices: ['desktop'],
            locales: ['de-DE', 'en-US'],
            operatingSystems: ['windows', 'linux'],
        },
        headers: {
            // 'x-tock-scope': '{"businessId":19093,"businessGroupId":"14253","site":"EXPLORETOCK"}',
            // note that businessID is quoted in the header
            'x-tock-scope': JSON.stringify(tock_scope),
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'User-Agent': userAgent.toString(),
        },
        json: {}
    });
    return response.body;
}