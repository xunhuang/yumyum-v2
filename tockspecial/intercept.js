// puppeteer-extra is a drop-in replacement for puppeteer, 
// it augments the installed puppeteer with plugin functionality 
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques) 
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { head } = require('superagent');
puppeteer.use(StealthPlugin())

const TARGET_URL = "https://www.exploretock.com/api/consumer/calendar/full/v2";

// puppeteer usage as normal 
puppeteer.launch({ headless: true }).then(async browser => {
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
            console.log(requestParams);
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
        }
    })

    await page.goto('https://www.exploretock.com/thebaratosito/search?date=2024-01-20&size=2&time=20%3A00');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'cointracker_home.png', fullPage: true });
    await page.goto('https://www.exploretock.com/ssal/search?date=2024-01-20&size=2&time=20%3A00');
    await page.waitForTimeout(2000);
    await browser.close()
});