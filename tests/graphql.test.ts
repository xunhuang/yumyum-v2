import { describe } from "@jest/globals";
import dayjs from "dayjs";

import { JsonEntrySameWasDbEntry } from "../graphql/yummodule/JsonEntrySameWasDbEntry";
import { MetroAPI } from "../graphql/yummodule/MetroAPI";
import {
  BayAreaDocument,
  BayAreaQuery,
  Venue,
} from "../graphql/generated/graphql";
import { CreateVenue } from "./CreateVenue";
import { getYumYumGraphQLClient } from "./getYumYumGraphQLClient";

const Nanoid = require("nanoid");
export var client = getYumYumGraphQLClient();

describe("Testing calling GraphQL from apollo generated client", () => {
  beforeAll(async () => {});

  // describe('Lookup Reservation on server', () => {
  //     it('Lookup Resy reservation link meta info', async () => {
  //         const result = await client.query<LookupReservationInfoQuery>({
  //             query: LookupReservationInfoDocument, variables: { url: "https://resy.com/cities/sf/robin?date=2023-01-08&seats=2" }
  //         });
  //         expect(result.data.reservationInfo?.businessid).toEqual("1362");
  //         expect(result.data.reservationInfo?.urlSlug).toEqual("robin");
  //         expect(result.data.reservationInfo?.resyCityCode).toEqual("sf");
  //     })
  //     it('Lookup Tock reservation link meta info', async () => {
  //         const result = await client.query<LookupReservationInfoQuery>({
  //             query: LookupReservationInfoDocument, variables: { url: "https://www.exploretock.com/theshotasf/" }
  //         });
  //         expect(result.data.reservationInfo?.businessid).toEqual("13420");
  //     })
  //     it('Lookup Opentable reservation link meta info', async () => {
  //         const result = await client.query<LookupReservationInfoQuery>({
  //             query: LookupReservationInfoDocument, variables: { url: "https://www.opentable.com/r/alderwood-santa-cruz?ref=18490" }
  //         });
  //         expect(result.data.reservationInfo?.businessid).toEqual("1057417");
  //     })
  // })

  describe("Query metros", () => {
    it("Query Bay Area", async () => {
      const metros = ["bayarea", "miami", "nyc", "tampa"];
      for (const metro of metros) {
        const metrodata = require(`../public/data/${metro}.json`);
        const listFromJsonFile = metrodata;
        const result = await client.query<BayAreaQuery>({
          query: BayAreaDocument,
          variables: { metro: metro },
        });
        const entrynodes = result.data?.allVenues?.nodes || [];
        const newOnly = listFromJsonFile.filter((jsonentry: any) => {
          const found = entrynodes.find(
            (dbentry: Venue | any, index: number, thisobject: any) => {
              return JsonEntrySameWasDbEntry(jsonentry, dbentry);
            }
          );
          return !found;
        });
        console.log(metro, "newOnly.length: " + newOnly.length);
        // for (var item of newOnly) {
        //   const result = await CreateVenue({
        //     key: Nanoid.nanoid(),
        //     vintage: dayjs().year().toString(),
        //     close: false,
        //     name: item.name,
        //     metro: metro,
        //     michelinslug: item.slug,
        //     michelinobjectid: item.objectID,
        //     address: item._highlightResult.street?.value || "",
        //     city: item.city.name,
        //     country: item.country.name,
        //     coverImage: item.main_image?.url || "",
        //     cuisine: item.cuisines.map((c: any) => c.label).join(", "),
        //     imageList: JSON.stringify(
        //       item.images?.map((i: any) => i.url) || []
        //     ),
        //     latitude: item._geoloc.lat,
        //     longitude: item._geoloc.lng,
        //     michelineOnlineReservation: item.online_booking === 1,
        //     region: item.region.name,
        //     reservation: "TBD",
        //     stars: item.michelin_award || "MICHELIN_PLATE",
        //     timezone: MetroAPI.getMetro(metro).timezone,
        //     url: item.slug,
        //     zip: item.slug,
        //   });
        //   console.log(JSON.stringify(result, null, 2));
        // }
      }
    });
  });
});
