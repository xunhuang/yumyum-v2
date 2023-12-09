// import { gotScraping } from 'got-scraping';
const functions = require('@google-cloud/functions-framework');
const { gotScraping } = require('got-scraping');

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.
functions.http('helloGET', async (req, res) => {
  const response = await gotScraping.post({
    // url: 'https://www.exploretock.com/api/consumer/offerings',
    url: "https://www.exploretock.com/api/consumer/calendar/full",
    responseType: 'json',
    headerGeneratorOptions: {
      browsers: [
        {
          name: 'chrome',
          minVersion: 100,
          maxVersion: 122
        }
      ],
      devices: ['desktop'],
      locales: ['de-DE', 'en-US'],
      operatingSystems: ['windows', 'linux'],
    },
    headers: {
      'x-tock-scope': '{"businessId":19093,"businessGroupId":"14253","site":"EXPLORETOCK"}',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'
    },
    json: {
    }
  });

  console.log(JSON.stringify(response.body));
  res.send(JSON.stringify(response.body));
});

functions.http('helloGET2', async (req, res) => {
  res.send("hello world");
});
