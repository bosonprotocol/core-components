import { getOfferById, getAllOffersOfSeller } from "../../src/offers/subgraph";
import { ADDRESS } from "@bosonprotocol/common/tests/mocks";
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

describe("#getAllOffersOfSeller()", () => {
  test("throw if response not okay", async () => {
    interceptSubgraph().reply(500);

    await expect(getAllOffersOfSeller(SUBGRAPH_URL, ADDRESS)).rejects.toThrow();
  });

  test("throw if graphql errors", async () => {
    interceptSubgraph().reply(200, {
      errors: ["some errors"]
    });

    await expect(getAllOffersOfSeller(SUBGRAPH_URL, ADDRESS)).rejects.toThrow();
  });

  test("return raw offers from subgraph", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph();
    interceptSubgraph().reply(200, {
      data: {
        seller: {
          offers: [mockedRawOfferFromSubgraph]
        }
      }
    });

    const rawOffers = await getAllOffersOfSeller(SUBGRAPH_URL, ADDRESS);

    expect(rawOffers).toMatchObject([mockedRawOfferFromSubgraph]);
  });
});
