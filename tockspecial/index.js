const functions = require('@google-cloud/functions-framework');
const { gotScraping } = require('got-scraping');
const UserAgent = require('user-agents');

const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

venuetimezone = "America/Los_Angeles";

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.
functions.http('helloGET', async (req, res) => {

  // paramater are passed as query string like
  // https://us-central1-<project-name>.cloudfunctions.net/helloGET?a=1&b=2
  console.log(req.query);
  
  const userAgent = new UserAgent({ deviceCategory: 'mobile' })
  // const userAgent = new UserAgent();

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
      'User-Agent': userAgent.toString(),
    },
    json: {
    }
  });
  // console.log(JSON.stringify(response.body));
  // res.send(JSON.stringify(response.body));
  date="2024-01-26";
  party_size = 2;
      let total= [];

      if (!response.body.result) {
        return [];
      }
      let slots = response.body.result.ticketGroup;
      slots.forEach(function (slot) {
        console.log(slot.date);
        if (slot.date === date && slot.availableTickets > 0 && !slot.isCommunal) {
          // if (slot.date === date && slot.availableTickets > 0) {
          if (slot.minPurchaseSize <= party_size && slot.maxPurchaseSize >= party_size) {
            let datestr = dayjs.tz(date + " " + slot.time, venuetimezone).format();
            let ret = {
              time: datestr,
              // time: date+" "+slot.time,
            }
            if (slot.ticketTypePrice && slot.ticketTypePrice.length > 0) {
              ret.priceInCents = slot.ticketTypePrice[0].priceCents;
            }

            total.push(ret);
          }
        }
      });
  res.send(JSON.stringify(total));
});

functions.http('helloGET2', async (req, res) => {
  res.send("hello world");
});