import {
  createOffer,
  initCoreSDKWithFundedWallet,
  seedWallet17
} from "./utils";
import { OfferCreator } from "@bosonprotocol/common/src";

jest.setTimeout(60_000);

const seedWallet = seedWallet17; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-offers", () => {
  describe("buyer initiated offers", () => {
    test("Create a buyer initiated offer", async () => {
      const { coreSDK } = await initCoreSDKWithFundedWallet(seedWallet);
      const createdOffer = await createOffer(coreSDK, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 1
      });
      expect(createdOffer).toBeTruthy();
      expect(createdOffer.seller).toBeFalsy();
      expect(createdOffer.buyer).toBeTruthy();
      expect(createdOffer.creator).toEqual(OfferCreator.Buyer);
    });
  });
  test("Quantity must be 1 for buyer initiated offers", async () => {
    const { coreSDK } = await initCoreSDKWithFundedWallet(seedWallet);
    await expect(
      createOffer(coreSDK, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 2
      })
    ).rejects.toThrow("Quantity must be 1 for buyer initiated offers");
  });
});
