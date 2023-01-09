import { commitToOffer, completeExchange } from "../../src/exchanges/handler";
import { MockWeb3LibAdapter, ADDRESS } from "@bosonprotocol/common/tests/mocks";
import {
  interceptSubgraph,
  SUBGRAPH_URL,
  DAY_IN_MS,
  mockRawOfferFromSubgraph,
  mockRawExchangeFromSubgraph,
  ZERO_ADDRESS
} from "../mocks";

describe("#commitToOffer()", () => {
  test("throw if offer not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: null
      }
    });

    await expect(
      commitToOffer({
        buyer: ADDRESS,
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not exist/);
  });

  test("throw if offer already voided", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          voidedAt: String(Math.floor(Date.now() / 1000))
        })
      }
    });

    await expect(
      commitToOffer({
        buyer: ADDRESS,
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/voided/);
  });

  test("throw if offer is not valid yet", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          validFromDate: String(Math.floor((Date.now() + DAY_IN_MS) / 1000))
        })
      }
    });

    await expect(
      commitToOffer({
        buyer: ADDRESS,
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not valid/);
  });

  test("throw if offer is not valid anymore", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          validUntilDate: String(Math.floor((Date.now() - DAY_IN_MS) / 1000))
        })
      }
    });

    await expect(
      commitToOffer({
        buyer: ADDRESS,
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not valid/);
  });

  test("throw if offer is sold out", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          quantityAvailable: "0"
        })
      }
    });

    await expect(
      commitToOffer({
        buyer: ADDRESS,
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/sold out/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph()
      }
    });

    const txResponse = await commitToOffer({
      buyer: ADDRESS,
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      web3Lib: new MockWeb3LibAdapter()
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });
});

describe("#completeExchange()", () => {
  test("throw if offer not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        exchange: null
      }
    });

    await expect(
      completeExchange({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        exchangeId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not exist/);
  });

  test("throw if signer not buyer or operator", async () => {
    interceptSubgraph().reply(200, {
      data: {
        exchange: mockRawExchangeFromSubgraph()
      }
    });

    await expect(
      completeExchange({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        exchangeId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/buyer.*or operator.*/);
  });

  test("dont throw an error if fulfillment period not elapsed - if we're both buyer and seller", async () => {
    interceptSubgraph().reply(200, {
      data: {
        exchange: mockRawExchangeFromSubgraph(
          {
            redeemedDate: (Date.now() / 1000).toString()
          },
          {
            disputePeriodDuration: Math.floor(DAY_IN_MS / 1000).toString()
          }
        )
      }
    });

    await expect(
      completeExchange({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        exchangeId: 1,
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: ZERO_ADDRESS
        })
      })
    );
  });

  test("throw if fulfillment period not elapsed - if we're only the seller", async () => {
    interceptSubgraph().reply(200, {
      data: {
        exchange: mockRawExchangeFromSubgraph(
          {
            redeemedDate: (Date.now() / 1000).toString(),
            buyer: {
              wallet: "0x0000000000000000000000000000000000000001", // any address different from null address, which would be ours
              active: true,
              id: "22"
            }
          },
          {
            disputePeriodDuration: Math.floor(DAY_IN_MS / 1000).toString()
          }
        )
      }
    });

    await expect(
      completeExchange({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        exchangeId: 1,
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: ZERO_ADDRESS
        })
      })
    ).rejects.toThrow(/not elapsed/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        exchange: mockRawExchangeFromSubgraph(
          {
            redeemedDate: (Date.now() / 1000).toString()
          },
          {
            disputePeriodDuration: "0"
          }
        )
      }
    });

    const txResponse = await completeExchange({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      exchangeId: 1,
      web3Lib: new MockWeb3LibAdapter({
        getSignerAddress: ZERO_ADDRESS
      })
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });
});
