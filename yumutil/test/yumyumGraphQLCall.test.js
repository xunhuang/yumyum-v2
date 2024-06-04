const chai = require("chai");
const expect = chai.expect;
const { yumyumGraphQLCall } = require("../yumyumGraphQLCall");

describe("yumyum graphql calls", function () {
  it("basic graphql call for bay area", async function () {
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
    // expect(result).to.equal(5);
    expect(result.data.allVenues.totalCount).to.be.greaterThan(10);
    expect(result.data.allVenues.nodes).not.to.be.null;
  });
});
