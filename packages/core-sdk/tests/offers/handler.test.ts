import { createOffer } from "../../src/offers/handler";
import {
  MockMetadataStorage,
  MockWeb3LibAdapter,
  ADDRESS
} from "@bosonprotocol/common/tests/mocks";
import { mockCreateOfferArgs } from "../mocks";

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
          wait: async () => mockedTxHash
        }
      }),
      contractAddress: ADDRESS,
      metadataStorage: new MockMetadataStorage(),
      theGraphStorage: new MockMetadataStorage()
    });

    expect(txResponse.hash).toEqual(mockedTxHash);
  });
});
