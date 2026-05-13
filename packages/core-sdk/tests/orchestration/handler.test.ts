import { OfferCreator } from "@bosonprotocol/common";
import {
  MockWeb3LibAdapter,
  ADDRESS,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import { AddressZero } from "@ethersproject/constants";
import {
  commitToConditionalOfferAndRedeemVoucher,
  commitToOfferAndRedeemVoucher,
  createOfferCommitAndRedeem
} from "../../src/orchestration/handler";
import {
  interceptSubgraph,
  SUBGRAPH_URL,
  DAY_IN_MS,
  mockRawOfferFromSubgraph,
  ZERO_ADDRESS
} from "../mocks";

const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";

describe("#commitToOfferAndRedeemVoucher()", () => {
  test("throw if offer not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: null
      }
    });

    await expect(
      commitToOfferAndRedeemVoucher({
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
      commitToOfferAndRedeemVoucher({
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
      commitToOfferAndRedeemVoucher({
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
      commitToOfferAndRedeemVoucher({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/sold out/);
  });

  test("throw if offer is buyer-initiated", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          creator: OfferCreator.Buyer
        })
      }
    });

    await expect(
      commitToOfferAndRedeemVoucher({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not seller initiated/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph()
      }
    });

    const txResponse = await commitToOfferAndRedeemVoucher({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      web3Lib: new MockWeb3LibAdapter()
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });

  test("return tx request when returnTxInfo is true", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph()
      }
    });

    const txRequest = await commitToOfferAndRedeemVoucher({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      web3Lib: new MockWeb3LibAdapter(),
      returnTxInfo: true
    });

    expect(txRequest.to).toBe(ADDRESS);
    expect(typeof txRequest.data).toBe("string");
  });
});

describe("#commitToConditionalOfferAndRedeemVoucher()", () => {
  test("throw if offer not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: null
      }
    });

    await expect(
      commitToConditionalOfferAndRedeemVoucher({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        tokenId: 42,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/not exist/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph()
      }
    });

    const txResponse = await commitToConditionalOfferAndRedeemVoucher({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      tokenId: 42,
      web3Lib: new MockWeb3LibAdapter()
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });

  test("return tx request when returnTxInfo is true", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph()
      }
    });

    const txRequest = await commitToConditionalOfferAndRedeemVoucher({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      tokenId: 42,
      web3Lib: new MockWeb3LibAdapter(),
      returnTxInfo: true
    });

    expect(txRequest.to).toBe(ADDRESS);
    expect(typeof txRequest.data).toBe("string");
  });
});

describe("#createOfferCommitAndRedeem()", () => {
  const conditionStruct = {
    method: 0,
    tokenType: 0,
    tokenAddress: ZERO_ADDRESS,
    gatingType: 0,
    minTokenId: "0",
    maxTokenId: "0",
    threshold: "0",
    maxCommits: "0"
  };

  const createOfferAndCommitArgsMock = {
    ...mockCreateOfferArgs(),
    offerCreator: ADDRESS,
    committer: ADDRESS,
    condition: conditionStruct,
    useDepositedFunds: false,
    signature: MOCK_SIG,
    sellerId: "1",
    buyerId: "1",
    feeLimit: "0",
    mutualizerAddress: AddressZero,
    sellerOfferParams: {
      collectionIndex: "0",
      royaltyInfo: { recipients: [AddressZero], bps: ["0"] },
      mutualizerAddress: AddressZero
    }
  };

  function interceptCreateOfferQueries() {
    // dispute resolver lookup
    interceptSubgraph().reply(200, {
      data: {
        disputeResolver: {
          id: createOfferAndCommitArgsMock.disputeResolverId,
          fees: [
            {
              token: {
                address: createOfferAndCommitArgsMock.exchangeToken
              }
            }
          ]
        }
      }
    });

    // isFullOfferVoided -> nonListedOfferVoideds lookup
    interceptSubgraph().reply(200, {
      data: {
        nonListedOfferVoideds: []
      }
    });
  }

  test("return tx response", async () => {
    interceptCreateOfferQueries();

    const txResponse = await createOfferCommitAndRedeem({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      web3Lib: new MockWeb3LibAdapter(),
      createOfferAndCommitArgs: createOfferAndCommitArgsMock
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });

  test("return tx request when returnTxInfo is true", async () => {
    interceptCreateOfferQueries();

    const txRequest = await createOfferCommitAndRedeem({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      web3Lib: new MockWeb3LibAdapter(),
      createOfferAndCommitArgs: createOfferAndCommitArgsMock,
      returnTxInfo: true
    });

    expect(txRequest.to).toBe(ADDRESS);
    expect(typeof txRequest.data).toBe("string");
  });

  test("throw if dispute resolver does not exist", async () => {
    interceptSubgraph().reply(200, {
      data: {
        disputeResolver: null
      }
    });

    await expect(
      createOfferCommitAndRedeem({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        web3Lib: new MockWeb3LibAdapter(),
        createOfferAndCommitArgs: createOfferAndCommitArgsMock
      })
    ).rejects.toThrow(/does not exist/);
  });

  test("throw if the offer has been voided non-listed", async () => {
    // dispute resolver lookup
    interceptSubgraph().reply(200, {
      data: {
        disputeResolver: {
          id: createOfferAndCommitArgsMock.disputeResolverId,
          fees: [
            {
              token: {
                address: createOfferAndCommitArgsMock.exchangeToken
              }
            }
          ]
        }
      }
    });
    // isFullOfferVoided -> nonListedOfferVoideds returns a record
    interceptSubgraph().reply(200, {
      data: {
        nonListedOfferVoideds: [{ id: "0xanything" }]
      }
    });

    await expect(
      createOfferCommitAndRedeem({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        web3Lib: new MockWeb3LibAdapter(),
        createOfferAndCommitArgs: createOfferAndCommitArgsMock
      })
    ).rejects.toThrow(/voided/);
  });
});
