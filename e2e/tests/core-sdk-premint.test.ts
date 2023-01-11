import {
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet14
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet14; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-premint", () => {
  test("can reserveRange and then preMint some vouchers and there are still some left to preMint", async () => {
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
    await (await coreSDK.reserveRange(offerId, range)).wait();

    const resultRange = await coreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    const preMinted = 2;
    await (await coreSDK.preMint(offerId, preMinted)).wait();

    const count = await coreSDK.getAvailablePreMints(offerId);
    expect(Number(count.toString())).toBe(range - preMinted);
  });
  describe("burnPremintedVouchers", () => {
    test("burnPremintedVouchers - after voiding offer there should be no available premints", async () => {
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
      await (await coreSDK.reserveRange(offerId, range)).wait();

      const resultRange = await coreSDK.getRangeByOfferId(offerId);
      expect(Number(resultRange.length.toString())).toBe(range);

      const preMinted = 2;
      await (await coreSDK.preMint(offerId, preMinted)).wait();

      await (await coreSDK.voidOffer(offerId)).wait();

      await (await coreSDK.burnPremintedVouchers(offerId)).wait();

      const count = await coreSDK.getAvailablePreMints(offerId);
      expect(Number(count.toString())).toBe(0);
    });
  });
});
