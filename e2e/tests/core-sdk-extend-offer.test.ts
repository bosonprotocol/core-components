import { BigNumber } from "ethers";

import {
  createOffer,
  createSellerAndOffer,
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  seedWallet16
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet16; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-extend-offer", () => {
  test("Extend an offer", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const offerId = createdOffer.id;
    const newValidUntil = BigNumber.from(createdOffer.validUntilDate).add(1000);

    const tx = await coreSDK.extendOffer(offerId, newValidUntil.toString());
    await tx.wait();

    await coreSDK.waitForGraphNodeIndexing(tx);
    const offer = await coreSDK.getOfferById(offerId);
    expect(offer.validUntilDate).toEqual(newValidUntil.toString());
  });
  test("Extend offers (batch)", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    await ensureCreatedSeller(sellerWallet);

    const createdOffer1 = await createOffer(coreSDK);
    const createdOffer2 = await createOffer(coreSDK);

    const newValidUntil = BigNumber.from(createdOffer1.validUntilDate).add(
      1000
    );

    const tx = await coreSDK.extendOfferBatch(
      [createdOffer1.id, createdOffer2.id],
      newValidUntil.toString()
    );
    await tx.wait();

    await coreSDK.waitForGraphNodeIndexing(tx);
    const offer1 = await coreSDK.getOfferById(createdOffer1.id);
    expect(offer1.validUntilDate).toEqual(newValidUntil.toString());
    const offer2 = await coreSDK.getOfferById(createdOffer2.id);
    expect(offer2.validUntilDate).toEqual(newValidUntil.toString());
  });
});
