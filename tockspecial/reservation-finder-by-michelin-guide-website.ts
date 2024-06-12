import cheerio from "cheerio";
import {
  yumyumGraphQLCall,
  opentable_set_venue_reservation,
  tock_set_venue_reservation,
  resy_set_venue_reservation,
  simpleFetchGet,
  resyAPILookupByVenueID
} from "yumutil";

(async function main() {
  try {
    const bayAreaList = await BayAreaListWithTBD();
    for (let v of bayAreaList) {
      console.log("checking", v.url);
      const body = await simpleFetchGet(v.url);
      const $ = cheerio.load(body);

      let reservation_links: string[] = [];
      $('a[data-event="partner_book"]').each((index, element) => {
        console.log(element.attribs["href"]);
        reservation_links.push(element.attribs["href"]);
      });

      if (reservation_links.length === 0) {
        var venueId: string | null = null;

        // eslint-disable-next-line no-loop-func
        $('button[data-dtm-partner="resy"]').each((_, _element: any) => {
          const scriptTag = $("script")
            .filter((i, el) => $(el).html()!.includes("venueId"))
            .html();

          if (scriptTag) {
            const venueIdMatch = scriptTag.match(/venueId:\s*'(\d+)'/);
            venueId = venueIdMatch ? venueIdMatch[1] : null;
            console.log("resy", venueId);
          } else {
            console.log("resy: venueId not found");
          }
        });

        if (venueId) {
          const resyData = await resyAPILookupByVenueID(venueId);
          if (resyData.status === 400) {
            console.log(
              "Resy API returned 404, likely Michelin data is outdated."
            );
            continue;
          }

          const venue = resyData.results.venues[0];
          if (venue && venue.venue.id.resy.toString() === venueId) {
            console.log(v.url);
            await resy_set_venue_reservation(
              v.key,
              venue.venue.url_slug,
              venue.venue.location.code,
              venueId
            );
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
          const iosUrlContent = $('meta[property="al:ios:url"]').attr("content");
          const restaurantId: string | null = iosUrlContent?.match(/rid=(\d+)/)?.[1] || null;

          if (restaurantId) {
            console.log("Restaurant ID:", restaurantId, v.key);
            await opentable_set_venue_reservation(v.key, restaurantId);
            let url = `https://www.opentable.com/restaurant/profile/${restaurantId}/reserve`;
            console.log(url);
            continue;
          }
        } else if (reservation_links[0].includes("exploretock")) {
          const tocklink = reservation_links[0];
          const appconfig = await tock_fetch_app_config(tocklink);

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

async function tock_fetch_app_config(tocklink: string) {
  const tockwebsite = await simpleFetchGet(tocklink);
  const $ = cheerio.load(tockwebsite);

  let appconfig: any = {};
  $("script").map((i, el) => {
    let text = $(el).html();
    if (text?.includes("window.$REDUX_STATE = ")) {
      const toeval = text.replace("window.$REDUX_STATE", "appconfig");
      eval(toeval);
    }
    return null;
  });
  return appconfig;
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
