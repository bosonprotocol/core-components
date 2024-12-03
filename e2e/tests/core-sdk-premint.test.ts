import { BigNumber, Wallet } from "ethers";
import { parseEther } from "@ethersproject/units";

import {
  createPremintedOfferAddToGroup,
  createPremintedOfferWithCondition,
  createRandomWallet,
  createSeaportOrder,
  createSeller,
  createSellerAndOffer,
  createSellerAndPremintedOffer,
  createSellerAndPremintedOfferWithCondition,
  ensureMintedERC1155,
  initCoreSDKWithFundedWallet,
  MOCK_ERC1155_ADDRESS,
  MOCK_SEAPORT_ADDRESS,
  seedWallet14,
  seedWallet15
} from "./utils";

import { ExchangeState } from "../../packages/core-sdk/src/subgraph";
import {
  EvaluationMethod,
  GatingType,
  Range,
  TokenType
} from "../../packages/common/src";

jest.setTimeout(60_000);

const seedWallet = seedWallet14; // be sure the seedWallet is not used by another test (to allow concurrent run)
const buyerWallet = seedWallet15;

describe("core-sdk-premint", () => {
  test("can reserveRange and then preMint some vouchers and there are still some left to preMint", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    const { quantityAvailable } = createdOffer;
    expect(createdOffer.seller).toBeTruthy();
    expect(Number(quantityAvailable)).toBeGreaterThan(0);

    const offerId = createdOffer.id;
    const range = 8;
    const receipt = await (
      await coreSDK.reserveRange(offerId, range, "seller")
    ).wait();
    await coreSDK.waitForGraphNodeIndexing(receipt);

    const offerReserveRange = await coreSDK.getOfferById(offerId);
    expect(Number(offerReserveRange.quantityAvailable)).toBe(
      Number(quantityAvailable) - range
    );

    const resultRange = await coreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    const offer = await coreSDK.getOfferById(offerId);
    expect(offer.range).toBeTruthy();

    const preMinted = 3;
    await (await coreSDK.preMint(offerId, preMinted)).wait();

    const availablePreMints = await coreSDK.getAvailablePreMints(offerId);
    expect(Number(availablePreMints.toString())).toBe(range - preMinted);
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
    await (await sellerCoreSDK.reserveRange(offerId, range, "seller")).wait();

    const preMinted = 2;
    const receipt = await (
      await sellerCoreSDK.preMint(offerId, preMinted)
    ).wait();

    const resultRange = await sellerCoreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    await sellerCoreSDK.waitForGraphNodeIndexing(receipt);
    const offer = await sellerCoreSDK.getOfferById(offerId);
    expect(offer.range).toBeTruthy();

    await (
      await sellerCoreSDK.depositFunds(createdOffer.seller.id, parseEther("5"))
    ).wait();
    const tokenId = resultRange.start;
    const exchangeId = getExchangeIdFromRange(resultRange);

    const receipt2 = await (
      await sellerCoreSDK.transferFrom(offerId, buyerWallet.address, tokenId)
    ) // this will call commitToPreMintedOffer and create an exchange
      .wait();
    await sellerCoreSDK.waitForGraphNodeIndexing(receipt2);
    const exchange = await sellerCoreSDK.getExchangeById(exchangeId);
    expect(exchange.state).toBe(ExchangeState.COMMITTED);
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
    await (await sellerCoreSDK.reserveRange(offerId, range, "seller")).wait();

    const preMinted = 2;
    const receipt = await (
      await sellerCoreSDK.preMint(offerId, preMinted)
    ).wait();

    const resultRange = await sellerCoreSDK.getRangeByOfferId(offerId);
    expect(Number(resultRange.length.toString())).toBe(range);

    await sellerCoreSDK.waitForGraphNodeIndexing(receipt);
    const offer = await sellerCoreSDK.getOfferById(offerId);
    expect(offer.range).toBeTruthy();

    await (
      await sellerCoreSDK.depositFunds(createdOffer.seller.id, parseEther("5"))
    ).wait();
    const tokenId = resultRange.start;
    const exchangeId = getExchangeIdFromRange(resultRange);
    const receipt2 = await (
      await sellerCoreSDK.transferFrom(
        offerId,
        fundedBuyerWallet.address,
        tokenId
      )
    ) // this will call commitToPreMintedOffer and create an exchange
      .wait();
    await sellerCoreSDK.waitForGraphNodeIndexing(receipt2);

    await (await buyerCoreSDK.redeemVoucher(exchangeId)).wait();

    const receipt3 = await (
      await buyerCoreSDK.raiseAndEscalateDispute(exchangeId)
    ).wait();
    await buyerCoreSDK.waitForGraphNodeIndexing(receipt3);

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
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);

      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      expect(createdOffer).toBeTruthy();
      expect(createdOffer.seller).toBeTruthy();

      const offerId = createdOffer.id;
      const range = 10;
      const receipt = await (
        await coreSDK.reserveRange(offerId, range, "seller")
      ).wait();

      const resultRange = await coreSDK.getRangeByOfferId(offerId);
      expect(Number(resultRange.length.toString())).toBe(range);

      await coreSDK.waitForGraphNodeIndexing(receipt);
      const offer = await coreSDK.getOfferById(offerId);
      expect(offer.range).toBeTruthy();

      const preMinted = 2;
      await (await coreSDK.preMint(offerId, preMinted)).wait();

      await (await coreSDK.voidOffer(offerId)).wait();

      await (await coreSDK.burnPremintedVouchers(offerId, preMinted)).wait();

      const count = await coreSDK.getAvailablePreMints(offerId);
      expect(Number(count.toString())).toBe(0);
    });
  });
  test("can approve preminted tokens for contract", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const openseaConduit = createRandomWallet().address;
    const isApprovedForAllBefore = await coreSDK.isApprovedForAll(
      openseaConduit,
      { owner: createdOffer.seller.voucherCloneAddress }
    );
    expect(isApprovedForAllBefore).toEqual(false);

    const txApproval = await coreSDK.setApprovalForAllToContract(
      openseaConduit,
      true
    );
    await txApproval.wait();

    const isApprovedForAllAfter = await coreSDK.isApprovedForAll(
      openseaConduit,
      { owner: createdOffer.seller.voucherCloneAddress }
    );
    expect(isApprovedForAllAfter).toEqual(true);
  });
  test("can call seaport via voucher contract to validate listing preminted tokens", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();

    const voucherBalanceBefore = await coreSDK.erc721BalanceOf({
      owner: createdOffer.seller.voucherCloneAddress,
      contractAddress: createdOffer.seller.voucherCloneAddress
    });

    const offerId = createdOffer.id;
    const range = 10;
    await (await coreSDK.reserveRange(offerId, range, "contract")).wait();

    const resultRange = await coreSDK.getRangeByOfferId(offerId);

    const preMinted = 2;
    await (await coreSDK.preMint(offerId, preMinted)).wait();

    const voucherBalanceAfter = await coreSDK.erc721BalanceOf({
      owner: createdOffer.seller.voucherCloneAddress,
      contractAddress: createdOffer.seller.voucherCloneAddress
    });
    expect(
      BigNumber.from(voucherBalanceAfter).sub(voucherBalanceBefore).toNumber()
    ).toEqual(preMinted);

    const tokenId = resultRange.start.toString();
    const owner = await coreSDK.erc721OwnerOf({
      tokenId,
      contractAddress: createdOffer.seller.voucherCloneAddress
    });
    expect(owner.toLowerCase()).toEqual(
      createdOffer.seller.voucherCloneAddress.toLowerCase()
    );

    const openseaConduit = createRandomWallet().address;
    const isApprovedForAllBefore = await coreSDK.isApprovedForAll(
      openseaConduit,
      { owner: createdOffer.seller.voucherCloneAddress }
    );
    expect(isApprovedForAllBefore).toEqual(false);

    const order = createSeaportOrder({
      offerer: createdOffer.seller.voucherCloneAddress,
      token: createdOffer.seller.voucherCloneAddress,
      tokenId,
      openseaTreasury: openseaConduit
    });

    const txValidate = await coreSDK.validateSeaportOrders(
      openseaConduit,
      MOCK_SEAPORT_ADDRESS,
      [order]
    );
    expect(txValidate).toBeTruthy();
    const txValidateResult = await txValidate.wait();
    expect(txValidateResult).toBeTruthy();

    const isApprovedForAllAfter = await coreSDK.isApprovedForAll(
      openseaConduit,
      { owner: createdOffer.seller.voucherCloneAddress }
    );
    expect(isApprovedForAllAfter).toEqual(true);
  });
});

describe("orchestration", () => {
  test("#createPremintedOfferWithCondition()", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    await createSeller(coreSDK, fundedWallet.address);

    // Ensure the condition token is minted
    const tokenID = Date.now().toString();
    await ensureMintedERC1155(fundedWallet, tokenID, "5");
    const condition = {
      method: EvaluationMethod.Threshold,
      tokenType: TokenType.MultiToken,
      tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
      gatingType: GatingType.PerAddress,
      minTokenId: tokenID,
      maxTokenId: tokenID,
      threshold: "1",
      maxCommits: "3"
    };
    const premintParameters = {
      reservedRangeLength: "5",
      to: fundedWallet.address
    };

    const offer = await createPremintedOfferWithCondition(
      coreSDK,
      condition,
      premintParameters
    );
    expect(offer).toBeTruthy();
    expect(offer.range).toBeTruthy();
    expect(offer.range?.owner?.toLowerCase()).toEqual(
      premintParameters.to.toLowerCase()
    );
    expect(Number(offer.range?.end) - Number(offer.range?.start) + 1).toEqual(
      Number(premintParameters.reservedRangeLength)
    );
    expect(offer.condition).toBeTruthy();
    expect(offer.condition?.tokenAddress.toLowerCase()).toEqual(
      condition.tokenAddress
    );
  });
  test("#createPremintedOfferAddToGroup()", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    await createSeller(coreSDK, fundedWallet.address);

    // Ensure the condition token is minted
    const tokenID = Date.now().toString();
    await ensureMintedERC1155(fundedWallet, tokenID, "5");
    const condition = {
      method: EvaluationMethod.Threshold,
      tokenType: TokenType.MultiToken,
      tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
      gatingType: GatingType.PerAddress,
      minTokenId: tokenID,
      maxTokenId: tokenID,
      threshold: "1",
      maxCommits: "3"
    };
    const premintParameters = {
      reservedRangeLength: "5",
      to: fundedWallet.address
    };

    const { offer, groupId } = await createPremintedOfferAddToGroup(
      coreSDK,
      condition,
      premintParameters
    );
    expect(offer).toBeTruthy();
    expect(offer.range).toBeTruthy();
    expect(offer.range?.owner?.toLowerCase()).toEqual(
      premintParameters.to.toLowerCase()
    );
    expect(Number(offer.range?.end) - Number(offer.range?.start) + 1).toEqual(
      Number(premintParameters.reservedRangeLength)
    );
    expect(offer.condition).toBeTruthy();
    expect(offer.condition?.id).toEqual(groupId);
  });
  test("#createSellerAndPremintedOffer()", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const premintParameters = {
      reservedRangeLength: "5",
      to: fundedWallet.address
    };

    const offer = await createSellerAndPremintedOffer(
      coreSDK,
      fundedWallet.address,
      premintParameters
    );
    expect(offer).toBeTruthy();
    expect(offer.range).toBeTruthy();
    expect(offer.range?.owner?.toLowerCase()).toEqual(
      premintParameters.to.toLowerCase()
    );
    expect(Number(offer.range?.end) - Number(offer.range?.start) + 1).toEqual(
      Number(premintParameters.reservedRangeLength)
    );
  });
  test("#createSellerAndPremintedOfferWithCondition()", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    // Ensure the condition token is minted
    const tokenID = Date.now().toString();
    await ensureMintedERC1155(fundedWallet, tokenID, "5");
    const condition = {
      method: EvaluationMethod.Threshold,
      tokenType: TokenType.MultiToken,
      tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
      gatingType: GatingType.PerAddress,
      minTokenId: tokenID,
      maxTokenId: tokenID,
      threshold: "1",
      maxCommits: "3"
    };
    const premintParameters = {
      reservedRangeLength: "5",
      to: fundedWallet.address
    };

    const offer = await createSellerAndPremintedOfferWithCondition(
      coreSDK,
      fundedWallet.address,
      condition,
      premintParameters
    );
    expect(offer).toBeTruthy();
    expect(offer.range).toBeTruthy();
    expect(offer.range?.owner?.toLowerCase()).toEqual(
      premintParameters.to.toLowerCase()
    );
    expect(Number(offer.range?.end) - Number(offer.range?.start) + 1).toEqual(
      Number(premintParameters.reservedRangeLength)
    );
    expect(offer.condition).toBeTruthy();
    expect(offer.condition?.tokenAddress.toLowerCase()).toEqual(
      condition.tokenAddress
    );
  });
});
function getExchangeIdFromRange(range: Range): number {
  return parseInt(
    BigNumber.from(range.start)
      .toHexString()
      .substring("0x".length)
      .substring(16),
    16
  );
}
