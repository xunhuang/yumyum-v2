import { describe, expect } from "@jest/globals";
import { yumyumGraphQLCall } from "yumutil";

describe("yumyum graphql calls", () => {
  it("basic graphql call for bay area", async () => {
    const query = `
    query MyQuery {
      allVenues(
        filter: {
          metro: { equalTo: "bayarea" }
          close: { equalTo: false }
        }
      ) {
        totalCount
        nodes {
          name
          urlSlug
          reservation
        }
      }
    }`;
    const result = await yumyumGraphQLCall(query);
    expect(result.data.allVenues.totalCount).toBeGreaterThan(10);
    expect(result.data.allVenues.nodes).not.toBeNull();
  });
});
