import { createOffer, voidOffer } from "../../src/offers/handler";
import {
  MockMetadataStorage,
  MockWeb3LibAdapter,
  ADDRESS,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import {
  interceptSubgraph,
  SUBGRAPH_URL,
  mockRawOfferFromSubgraph
} from "../mocks";

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
            logs: []
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
    ).rejects.toThrow(`Offer with id "1" does not exist`);
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
    ).rejects.toThrow(`Offer with id "1" is already voided`);
  });

  test("throw if offer seller doesn't match signer", async () => {
    const sellerAddress = "0xREAL_SELLER";
    const signerAddress = "0xSIGNER_ADDRESS";

    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          seller: {
            address: sellerAddress
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
    ).rejects.toThrow(
      `Signer with address "${signerAddress}" is not the seller "${sellerAddress}"`
    );
  });

  test("return tx response", async () => {
    interceptSubgraph().reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          seller: {
            address: ADDRESS
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
