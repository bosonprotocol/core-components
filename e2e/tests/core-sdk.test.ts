import { utils, constants, BigNumberish } from "ethers";

import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { CoreSDK } from "../../packages/core-sdk/src";
import {
  ExchangeState,
  FundsEntityFieldsFragment,
  OfferFieldsFragment
} from "../../packages/core-sdk/src/subgraph";

import {
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  metadata,
  waitForGraphNodeIndexing
} from "./utils";

jest.setTimeout(60_000);

describe("core-sdk", () => {
  describe("core user flows", () => {
    test("create seller + offer", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();

      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      expect(createdOffer).toBeTruthy();
      expect(createdOffer.metadata).toMatchObject(metadata);
      expect(createdOffer.seller).toBeTruthy();
      expect(createdOffer.seller.operator.toLowerCase()).toBe(
        fundedWallet.address.toLowerCase()
      );
    });

    test("deposit seller funds", async () => {
      const sellerFundsDepositInEth = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      const funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: createdOffer.seller.id
      });

      expect(funds).toBeTruthy();
      expect(funds.availableAmount).toBe(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );
      expect(funds.token.symbol.toUpperCase()).toBe("ETH");
    });

    test("commit", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });

      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      expect(exchange).toBeTruthy();
    });

    test("revoke", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await sellerCoreSDK.revokeVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await sellerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Revoked);
      expect(exchangeAfterRevoke.revokedDate).toBeTruthy();
    });

    test("cancel", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.cancelVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Cancelled);
      expect(exchangeAfterRevoke.cancelledDate).toBeTruthy();
    });

    test("redeem", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.redeemVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Redeemed);
      expect(exchangeAfterRevoke.redeemedDate).toBeTruthy();
    });

    test("withdraw funds", async () => {
      const sellerFundsDepositInEth = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      const funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: createdOffer.seller.id
      });
      expect(funds.availableAmount).toEqual(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );

      const tokenAddress = funds.token.address;

      const updatedFunds = await withdrawFunds({
        coreSDK,
        sellerId: createdOffer.seller.id,
        tokenAddress,
        sellerFundsDepositInEth
      });

      expect(updatedFunds.availableAmount).toEqual("0");
    });
  });
});

async function createSellerAndOffer(coreSDK: CoreSDK, sellerAddress: string) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE"
  });
  const metadataUri = "ipfs://" + metadataHash;

  const createOfferTxResponse = await coreSDK.createSellerAndOffer(
    {
      operator: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      treasury: sellerAddress
    },
    mockCreateOfferArgs({
      metadataHash,
      metadataUri
    })
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

async function depositFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  fundsDepositAmountInEth?: string;
}): Promise<FundsEntityFieldsFragment> {
  const depositFundsTxResponse = await args.coreSDK.depositFunds(
    args.sellerId,
    utils.parseEther(args.fundsDepositAmountInEth || "5")
  );
  await depositFundsTxResponse.wait();

  await waitForGraphNodeIndexing();
  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId,
      token: constants.AddressZero
    }
  });

  return funds[0];
}

async function withdrawFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  tokenAddress: string;
  sellerFundsDepositInEth: string;
}): Promise<FundsEntityFieldsFragment> {
  const withdrawResponse = await args.coreSDK.withdrawFunds(
    args.sellerId,
    [args.tokenAddress],
    [utils.parseEther(args.sellerFundsDepositInEth)]
  );
  await withdrawResponse.wait();
  await waitForGraphNodeIndexing();

  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId,
      token: constants.AddressZero
    }
  });

  return funds[0];
}

async function commitToOffer(args: {
  buyerCoreSDK: CoreSDK;
  sellerCoreSDK: CoreSDK;
  offerId: BigNumberish;
}) {
  const commitToOfferTxResponse = await args.buyerCoreSDK.commitToOffer(
    args.offerId
  );
  const commitToOfferTxReceipt = await commitToOfferTxResponse.wait();
  const exchangeId = args.buyerCoreSDK.getCommittedExchangeIdFromLogs(
    commitToOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const exchange = await args.sellerCoreSDK.getExchangeById(
    exchangeId as string
  );
  return exchange;
}
