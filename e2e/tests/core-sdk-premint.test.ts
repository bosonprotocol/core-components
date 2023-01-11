import {
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet14
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet14; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-premint", () => {
  test("create seller and offer and then reserveRange", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const offerId = createdOffer.id;
    const range = 10;
    const tx = await coreSDK.reserveRange(offerId, range);
    await tx.wait();

    const resultRange = await coreSDK.getRangeByOfferId(offerId);
    console.log(resultRange);
  });
});
