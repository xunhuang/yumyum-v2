const functions = require('@google-cloud/functions-framework');
const { Redis } = require('@upstash/redis');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

functions.http('tock_pup', async(req, res) => {
    const result = await tock_pup(req.query.businessId, req.query.businessGroupId, req.query.venuetimezone, req.query.date, req.query.party_size);
    return res.send(result);
});

const redis = new Redis({
    url: 'https://usw1-native-monster-33884.upstash.io',
    token: 'AoRcACQgZGI3MzE1N2YtMTFkZC00YjEyLTg0OGQtZmZiZjc1Y2Y2Mzk4LwraMey4IVXa2OKkRWvMgY5GtMQMbkljGrjngks_ovc=',
})

functions.http('tock_redis', async (req, res) => {
    const data = await redis.get(`${req.query.urlSlug}-${req.query.date}`);
    return res.send(data);
});

async function tock_pup(businessId, businessGroupId, venuetimezone, date, party_size, urlSlug) {
    var result = {};
    // puppeteer usage as normal 
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if (request.url().includes('calendar')) {
            console.log('>>', request.method(), request.url())
                // console.log(request.headers());
            const requestParams = {};
            requestParams.method = request.method();
            requestParams.postData = request.postData();

            var headers = {
                ...request.headers(),
                'accept': 'application/json',
            }
            requestParams.headers = headers;
            // console.log(requestParams);
            request.continue(requestParams);
            return;
        }
        request.continue()
    })

    page.on('response', async(response) => {
        if (response.url().includes('calendar')) {
            console.log('<<', response.status(), response.url())
            const text = await response.text();
            console.log(text.slice(0, 220));
            result = text;
        }
    })

    await page.goto('https://www.exploretock.com/thebaratosito/search?date=2024-01-20&size=2&time=20%3A00');
    await page.waitForTimeout(1000);
    await browser.close()
    return result;
}
