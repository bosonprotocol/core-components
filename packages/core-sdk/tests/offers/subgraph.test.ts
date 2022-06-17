import { getOfferById, getOffers } from "../../src/offers/subgraph";
import {
  SUBGRAPH_URL,
  interceptSubgraph,
  mockRawOfferFromSubgraph
} from "../mocks";

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

describe("#getOffers()", () => {
  test("throw if response not okay", async () => {
    interceptSubgraph().reply(500);

    await expect(getOffers(SUBGRAPH_URL)).rejects.toThrow();
  });

  test("throw if graphql errors", async () => {
    interceptSubgraph().reply(200, {
      errors: ["some errors"]
    });

    await expect(getOffers(SUBGRAPH_URL)).rejects.toThrow();
  });

  test("return raw offers from subgraph", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph();
    interceptSubgraph().reply(200, {
      data: {
        offers: [mockedRawOfferFromSubgraph]
      }
    });

    const rawOffers = await getOffers(SUBGRAPH_URL);

    expect(rawOffers).toMatchObject([mockedRawOfferFromSubgraph]);
  });
});
