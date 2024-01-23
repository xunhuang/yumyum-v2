// puppeteer-extra is a drop-in replacement for puppeteer, 
// it augments the installed puppeteer with plugin functionality 
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques) 
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

const BayAreaSlugs = require('./bayareatockslug.json');

// puppeteer usage as normal 
puppeteer.launch({ headless: "new" }).then(async browser => {
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
            const requestheader = response.request().headers();
            // console.log(requestheader['x-tock-scope']);
            console.log(requestheader['x-tock-path']);

            const text = await response.text();
            console.log(text.slice(0, 220));
            // console.log(text);
        }
    })

    for (var i = 0; i < BayAreaSlugs.length && i < 1000; i++) {
        var slug = BayAreaSlugs[i];
        const url = 'https://www.exploretock.com/' + slug + '/search?date=2024-01-30&size=2&time=20%3A00';
        console.log("going to " + url);
        await page.goto(url);
        await page.waitForTimeout(2000);
        // await page.screenshot({ path: slug + '_home.png', fullPage: true });
        // await page.screenshot({ path: 'cointracker_home.png', fullPage: true });
    }

    await browser.close()
});