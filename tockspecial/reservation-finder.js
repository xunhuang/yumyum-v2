const cheerio = require("cheerio");

const { yumyumGraphQLCall } = require("./yumyumGraphQLCall");
const { opentable_set_venue_reservation, tock_set_venue_reservation } = require("./resy_support");
const { resy_set_venue_reservation } = require("./resy_support");
const dayjs = require("dayjs");
const { buildUrl } = require("build-url");
const { resyAPIFetch } = require("./resy_support");

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log("checking", v.url)
      // if (v.url === "https://guide.michelin.com/us/en/california/san-francisco/restaurant/nisei") {
      //   continue
      // }
      const body = await simpleFetchGet(v.url);
      const $ = cheerio.load(body);

      var reservation_links = [];
      // eslint-disable-next-line no-loop-func
      $('a[data-event="partner_book"]').each((index, element) => {
        console.log(element.attribs["href"]);
        reservation_links.push(element.attribs["href"]);
      });

      if (reservation_links.length === 0) {
        var resy = false;
        var venueId = null;

        // eslint-disable-next-line no-loop-func
        $('button[data-dtm-partner="resy"]').each((index, element) => {
          const scriptTag = $("script")
            .filter((i, el) => $(el).html().includes("venueId"))
            .html();

          if (scriptTag) {
            const venueIdMatch = scriptTag.match(/venueId:\s*'(\d+)'/);
            venueId = venueIdMatch ? venueIdMatch[1] : null;
            console.log("resy", venueId);
          } else {
            console.log("resy: venueId not found");
          }
          resy = true;
        });

        if (resy) {
          const resyData = await resyAPILookupByVenueID(venueId);
          // this call may fail because Michelin may not have the correct data
          // as a venue may have moved to a different platform and not 
          // updated their Michelin page
          if (resyData.status === 400) {
            console.log("Resy API returned 404, likely Michelin data is outdated (it thinks it's resy, but resy disagreeds).");
            continue;
          }

          const venue = resyData.results.venues[0];
          if (venue && venue.venue.id.resy.toString() === venueId) {
            // console.log(JSON.stringify(venue, null, 2));
            console.log(v.url);
            await resy_set_venue_reservation(v.key, venue.venue.url_slug, venue.venue.location.code, venueId);
          } else {
            console.log("Resy API returned no venue data, not sure why");
            break;
          }
        }
      } else {
        if (reservation_links[0].includes("opentable")) {
          const opentablelink = reservation_links[0];
          const opentablewebsite = await simpleFetchGet(opentablelink);
          const $ = cheerio.load(opentablewebsite);
          // Extract the restaurantId from the 'al:ios:url' meta tag
          const iosUrlContent = $('meta[property="al:ios:url"]').attr('content');
          const restaurantId = iosUrlContent.match(/rid=(\d+)/)[1];

          console.log(v);
          console.log('Restaurant ID:', restaurantId, v.key);
          await opentable_set_venue_reservation(v.key, restaurantId);
          let url = `https://www.opentable.com/restaurant/profile/${restaurantId}/reserve`;
          console.log(url);
        } else if (reservation_links[0].includes("exploretock")) {
          const tocklink = reservation_links[0];
          const tockwebsite = await simpleFetchGet(tocklink);
          const $ = cheerio.load(tockwebsite);

          var appconfig = {};
          $("script").map((i, el) => {
            let text = $(el).html();
            if (text?.includes("window.$REDUX_STATE = ")) {
              const toeval = text.replace("window.$REDUX_STATE", "appconfig");
              // eslint-disable-next-line
              eval(toeval);
            }
            return null;
          });

          const businessid = appconfig.app.config.business.id;
          const slug = appconfig.app.config.business.domainName;
          console.log(businessid);
          console.log(slug);
          await tock_set_venue_reservation(v.key, businessid, slug);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

async function simpleFetchGet(url) {
  const content = await fetch(
    url,
    {
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        priority: "u=0, i",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    }
  );

  const body = await content.text();
  return body;
}

async function BayAreaListWithTBD() {
  const query = `
query MyQuery {
  allVenues(
    filter: {
      metro: { equalTo: "bayarea" }
      reservation: { equalTo: "TBD" }
      close: { equalTo: false }
      michelinobjectid: { isNull: false }
      url: { startsWith: "https://guide.michelin.com" }
    }
  ) {
    totalCount
    nodes {
      name
      urlSlug
      key
      michelinslug
      michelinId
      url
      realurl
      michelinobjectid
      tags
      michelineOnlineReservation
    }
  }
}`;

  const json = await yumyumGraphQLCall(query);
  return json.data.allVenues.nodes;
}


async function resyAPILookupByVenueID(venue_id) {
  const url = buildUrl("https://api.resy.com", {
    path: "4/find",
    queryParams: {
      long: 0,
      lat: 0,
      venue_id: venue_id,
      party_size: 2,
      day: dayjs().format("YYYY-MM-DD"),
    },
  });
  return await resyAPIFetch(url);
}