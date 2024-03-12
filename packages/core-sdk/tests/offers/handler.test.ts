import {
  createOffer,
  voidOffer,
  voidOfferBatch
} from "../../src/offers/handler";
import {
  MockMetadataStorage,
  MockWeb3LibAdapter,
  ADDRESS,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import {
  interceptSubgraph,
  SUBGRAPH_URL,
  mockRawOfferFromSubgraph,
  ZERO_ADDRESS
} from "../mocks";
const sellerMetadataUri =
  "ipfs://Qmcp1cqzUu62CggNpA45p4LmQuExYjoW4yazv11JdEMESj";
describe("#createOffer()", () => {
  test("throw for invalid args", () => {
    expect(() =>
      createOffer({
        offerToCreate: mockCreateOfferArgs({
          price: "invalid"
        }),
        web3Lib: new MockWeb3LibAdapter(),
        contractAddress: ADDRESS
      })
    ).rejects.toThrow();
  });

  test("return tx response", async () => {
    const mockedTxHash = "0xTX_HASH";
    const txResponse = await createOffer({
      offerToCreate: mockCreateOfferArgs(),
      web3Lib: new MockWeb3LibAdapter({
        sendTransaction: {
          hash: mockedTxHash,
          wait: async () => ({
            from: "0x",
            to: "0x",
            logs: [],
            transactionHash: "0x",
            effectiveGasPrice: "0",
            blockNumber: 0
          })
        }
      }),
      contractAddress: ADDRESS,
      metadataStorage: new MockMetadataStorage(),
      theGraphStorage: new MockMetadataStorage()
    });

    expect(txResponse.hash).toEqual(mockedTxHash);
  });
});

describe("#voidOffer()", () => {
  test("throw if offer not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: null
      }
    });

    await expect(
      voidOffer({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/does not exist/);
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
      voidOffer({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/already voided/);
  });

  test("throw if offer seller doesn't match signer", async () => {
    const sellerAddress = "0xREAL_SELLER";
    const signerAddress = "0xSIGNER_ADDRESS";

    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          seller: {
            id: "1",
            assistant: sellerAddress,
            admin: sellerAddress,
            clerk: ZERO_ADDRESS,
            treasury: sellerAddress,
            authTokenId: "0",
            authTokenType: 0,
            royaltyRecipients: [
              {
                id: "1-royalty-0x0000000000000000000000000000000000000000",
                recipient: {
                  id: "0x0000000000000000000000000000000000000000",
                  wallet: "0x0000000000000000000000000000000000000000",
                  royalties: [
                    {
                      bps: "0",
                      offer: {
                        id: "1"
                      }
                    }
                  ]
                },
                minRoyaltyPercentage: "0"
              }
            ],
            voucherCloneAddress: "0x0000111122223333444455556666777788889999",
            active: true,
            contractURI: "ipfs://seller-contract-uri",
            metadataUri: sellerMetadataUri
          }
        })
      }
    });

    await expect(
      voidOffer({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: signerAddress
        })
      })
    ).rejects.toThrow(/not the assistant/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          seller: {
            id: "1",
            assistant: ADDRESS,
            admin: ADDRESS,
            clerk: ZERO_ADDRESS,
            treasury: ADDRESS,
            authTokenId: "0",
            authTokenType: 0,
            royaltyRecipients: [
              {
                id: "1-royalty-0x0000000000000000000000000000000000000000",
                recipient: {
                  id: "0x0000000000000000000000000000000000000000",
                  wallet: "0x0000000000000000000000000000000000000000",
                  royalties: [
                    {
                      bps: "0",
                      offer: {
                        id: "1"
                      }
                    }
                  ]
                },
                minRoyaltyPercentage: "0"
              }
            ],
            voucherCloneAddress: "0x0000111122223333444455556666777788889999",
            active: true,
            contractURI: "ipfs://seller-contract-uri",
            metadataUri: sellerMetadataUri
          }
        })
      }
    });

    const txResponse = await voidOffer({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerId: 1,
      web3Lib: new MockWeb3LibAdapter({
        getSignerAddress: ADDRESS
      })
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });
});

describe("#voidOfferBatch()", () => {
  test("throw if offers not existent", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offers: []
      }
    });

    await expect(
      voidOfferBatch({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerIds: [1, 2, 3],
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/does not exist/);
  });

  test("throw if offers already voided", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offers: [
          mockRawOfferFromSubgraph({
            id: "1",
            voidedAt: String(Math.floor(Date.now() / 1000))
          })
        ]
      }
    });

    await expect(
      voidOfferBatch({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerIds: [1],
        web3Lib: new MockWeb3LibAdapter()
      })
    ).rejects.toThrow(/already voided/);
  });

  test("throw if offer seller doesn't match signer", async () => {
    const sellerAddress = "0xREAL_SELLER";
    const signerAddress = "0xSIGNER_ADDRESS";

    interceptSubgraph().reply(200, {
      data: {
        offers: [
          mockRawOfferFromSubgraph({
            id: "1",
            seller: {
              id: "1",
              assistant: sellerAddress,
              admin: sellerAddress,
              clerk: ZERO_ADDRESS,
              treasury: sellerAddress,
              authTokenId: "0",
              authTokenType: 0,
              royaltyRecipients: [
                {
                  id: "1-royalty-0x0000000000000000000000000000000000000000",
                  recipient: {
                    id: "0x0000000000000000000000000000000000000000",
                    wallet: "0x0000000000000000000000000000000000000000",
                    royalties: [
                      {
                        bps: "0",
                        offer: {
                          id: "1"
                        }
                      }
                    ]
                  },
                  minRoyaltyPercentage: "0"
                }
              ],
              voucherCloneAddress: "0x0000111122223333444455556666777788889999",
              active: true,
              contractURI: "ipfs://seller-contract-uri",
              metadataUri: sellerMetadataUri
            }
          })
        ]
      }
    });

    await expect(
      voidOfferBatch({
        contractAddress: ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        offerIds: [1],
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: signerAddress
        })
      })
    ).rejects.toThrow(/not the assistant/);
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offers: [
          mockRawOfferFromSubgraph({
            id: "1",
            seller: {
              id: "1",
              assistant: ADDRESS,
              admin: ADDRESS,
              clerk: ZERO_ADDRESS,
              treasury: ADDRESS,
              authTokenId: "0",
              authTokenType: 0,
              royaltyRecipients: [
                {
                  id: "1-royalty-0x0000000000000000000000000000000000000000",
                  recipient: {
                    id: "0x0000000000000000000000000000000000000000",
                    wallet: "0x0000000000000000000000000000000000000000",
                    royalties: [
                      {
                        bps: "0",
                        offer: {
                          id: "1"
                        }
                      }
                    ]
                  },
                  minRoyaltyPercentage: "0"
                }
              ],
              voucherCloneAddress: "0x0000111122223333444455556666777788889999",
              active: true,
              contractURI: "ipfs://seller-contract-uri",
              metadataUri: sellerMetadataUri
            }
          })
        ]
      }
    });

    const txResponse = await voidOfferBatch({
      contractAddress: ADDRESS,
      subgraphUrl: SUBGRAPH_URL,
      offerIds: [1],
      web3Lib: new MockWeb3LibAdapter({
        getSignerAddress: ADDRESS
      })
    });

    expect(typeof txResponse.hash === "string").toBeTruthy();
  });
});
