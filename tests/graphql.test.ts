import { describe } from "@jest/globals";

import { JsonEntrySameWasDbEntry } from "../yumutil/src";
import {
  BayAreaDocument,
  BayAreaQuery,
  Venue,
} from "../graphql/generated/graphql";
import { getYumYumGraphQLClient } from "./getYumYumGraphQLClient";

export var client = getYumYumGraphQLClient();

describe("Testing calling GraphQL from apollo generated client", () => {
  beforeAll(async () => {});


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
      }
    });
  });
});
