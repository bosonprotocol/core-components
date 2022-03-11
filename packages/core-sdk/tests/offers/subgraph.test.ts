import nock from "nock";
import { getOfferById } from "../../src/offers/subgraph";

import { mockRawOfferFromSubgraph } from "../mocks";

const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs";

function interceptSubgraph() {
  return nock(SUBGRAPH_URL).post("", (body) => {
    return body.query && body.variables;
  });
}

describe("#getOfferById()", () => {
  test("throw if response not okay", async () => {
    interceptSubgraph().reply(500);

    await expect(getOfferById(SUBGRAPH_URL, "1")).rejects.toThrow();
  });

  test("throw if graphql errors", async () => {
    interceptSubgraph().reply(200, {
      errors: ["some errors"]
    });

    await expect(getOfferById(SUBGRAPH_URL, "1")).rejects.toThrow();
  });

  test("return raw offer from subgraph", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph();
    interceptSubgraph().reply(200, {
      data: {
        offer: mockedRawOfferFromSubgraph
      }
    });

    const rawOffer = await getOfferById(
      SUBGRAPH_URL,
      mockedRawOfferFromSubgraph.id
    );

    expect(rawOffer).toMatchObject(mockedRawOfferFromSubgraph);
  });
});
