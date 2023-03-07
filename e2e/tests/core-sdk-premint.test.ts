import { parseEther } from "@ethersproject/units";

import {
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet14,
  seedWallet15,
  waitForGraphNodeIndexing
} from "./utils";

import { ExchangeState } from "../../packages/core-sdk/src/subgraph";

jest.setTimeout(60_000);

const seedWallet = seedWallet14; // be sure the seedWallet is not used by another test (to allow concurrent run)
const buyerWallet = seedWallet15;

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
  test("can commit to a preMinted voucher", async () => {
    const { coreSDK: sellerCoreSDK, fundedWallet: fundedSellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      sellerCoreSDK,
      fundedSellerWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const offerId = createdOffer.id;

    const range = 10;
    await (await sellerCoreSDK.reserveRange(offerId, range)).wait();

    const preMinted = 2;
    await (await sellerCoreSDK.preMint(offerId, preMinted)).wait();

    const resultRange = await sellerCoreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    await (
      await sellerCoreSDK.depositFunds(createdOffer.seller.id, parseEther("5"))
    ).wait();
    const exchangeId = resultRange.start;
    await (
      await sellerCoreSDK.transferFrom(offerId, buyerWallet.address, exchangeId)
    ) // this will call commitToPreMintedOffer and create an exchange
      .wait();
    await waitForGraphNodeIndexing();
    const exchange = await sellerCoreSDK.getExchangeById(exchangeId);
    expect(exchange.state).toBe(ExchangeState.Committed);
  });
  test("raiseAndEscalateDispute with a preMinted exchange", async () => {
    const { coreSDK: buyerCoreSDK, fundedWallet: fundedBuyerWallet } =
      await initCoreSDKWithFundedWallet(buyerWallet);
    const { coreSDK: sellerCoreSDK, fundedWallet: fundedSellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      sellerCoreSDK,
      fundedSellerWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const offerId = createdOffer.id;

    const range = 10;
    await (await sellerCoreSDK.reserveRange(offerId, range)).wait();

    const preMinted = 2;
    await (await sellerCoreSDK.preMint(offerId, preMinted)).wait();

    const resultRange = await sellerCoreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    await (
      await sellerCoreSDK.depositFunds(createdOffer.seller.id, parseEther("5"))
    ).wait();
    const exchangeId = resultRange.start;
    await (
      await sellerCoreSDK.transferFrom(
        offerId,
        fundedBuyerWallet.address,
        exchangeId
      )
    ) // this will call commitToPreMintedOffer and create an exchange
      .wait();
    await waitForGraphNodeIndexing();
    await waitForGraphNodeIndexing();

    await (await buyerCoreSDK.redeemVoucher(exchangeId)).wait();

    await (await buyerCoreSDK.raiseAndEscalateDispute(exchangeId)).wait();
    await waitForGraphNodeIndexing();

    const escalatedExchange = await sellerCoreSDK.getExchangeById(exchangeId);
    expect(escalatedExchange?.dispute?.id).toBeTruthy();

    const dispute = await sellerCoreSDK.getDisputeById(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      escalatedExchange!.dispute!.id
    );
    expect(dispute?.exchangeId?.toString()).toBe(exchangeId.toString());
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
