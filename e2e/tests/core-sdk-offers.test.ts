import { parseEther } from "@ethersproject/units";
import { constants, Wallet } from "ethers";
import { CoreSDK } from "../../packages/core-sdk/src";
import {
  DisputeResolverFieldsFragment,
  ExchangeState,
  OfferFieldsFragment,
  SellerFieldsFragment
} from "../../packages/core-sdk/src/subgraph";
import {
  commitToBuyerOffer,
  commitToOffer,
  createDisputeResolver,
  createFundedWallet,
  createOffer,
  createSeller,
  deployerWallet,
  DR_FEE_MUTUALIZER_ADDRESS,
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  newAgreementToDRFeeMutualizer,
  payPremiumToDRFeeMutualizer,
  seedWallet17
} from "./utils";
import { OfferCreator } from "@bosonprotocol/common/src";
import {
  MSEC_PER_DAY,
  MSEC_PER_SEC
} from "./../../packages/common/src/utils/timestamp";

jest.setTimeout(60_000);

const seedWallet = seedWallet17; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-offers", () => {
  describe("buyer initiated offers", () => {
    let buyerCoreSDK: CoreSDK;
    let buyerWallet: Wallet;
    let buyerInitiatedOffer: OfferFieldsFragment;
    let sellerCoreSDK: CoreSDK;
    let sellerWallet: Wallet;
    let seller: SellerFieldsFragment;
    let disputeResolverCoreSDK: CoreSDK;
    let disputeResolver: DisputeResolverFieldsFragment;
    const exchangeToken = constants.AddressZero;
    const drFeeAmount = parseEther("0.0123");
    beforeAll(async () => {
      // Create another disputeResolver to ensure the DR feeAmount is not zero
      const drWallet = await createFundedWallet(seedWallet);
      const disputeResolverAddress = drWallet.address.toLowerCase();
      ({ disputeResolver, disputeResolverCoreSDK } =
        await createDisputeResolver(drWallet, deployerWallet, {
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName:
                exchangeToken === constants.AddressZero ? "Native" : "ERC20"
            }
          ],
          sellerAllowList: []
        }));
    });
    beforeEach(async () => {
      ({ sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
        await initSellerAndBuyerSDKs(seedWallet));
      buyerInitiatedOffer = await createOffer(buyerCoreSDK, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 1,
        disputeResolverId: disputeResolver.id,
        exchangeToken
      });
      seller = await createSeller(sellerCoreSDK, sellerWallet.address);
      // Buyer needs to deposit offer.price to allow a seller to commit to the offer
      await buyerCoreSDK.depositFunds(
        buyerInitiatedOffer.buyerId,
        buyerInitiatedOffer.price,
        exchangeToken
      );
      // Seller needs to deposit drFeeAmount to unlock committing (unless there is a mutualizer contract)
      const tx = await sellerCoreSDK.depositFunds(
        seller.id,
        drFeeAmount,
        exchangeToken
      );
      await buyerCoreSDK.waitForGraphNodeIndexing(tx);
    });
    test("Fetch the buyer created when creating the offer", async () => {
      const buyer = await buyerCoreSDK.getBuyerById(
        buyerInitiatedOffer.buyerId,
        {
          includeFunds: true
        }
      );
      expect(buyer).toBeTruthy();
      expect(buyer.wallet).toEqual(buyerWallet.address.toLowerCase());
      expect(buyer.funds).toBeTruthy();
      expect(buyer.funds?.length).toBeGreaterThan(0);
      const fund = buyer.funds?.find(
        (f) => f.token.address === buyerInitiatedOffer.exchangeToken.address
      );
      expect(fund).toBeTruthy();
      expect(fund?.availableAmount).toEqual(buyerInitiatedOffer.price);
    });
    test("Fetch the buyer initiated offer", async () => {
      expect(buyerInitiatedOffer).toBeTruthy();
      expect(buyerInitiatedOffer.seller).toBeFalsy();
      expect(buyerInitiatedOffer.buyer).toBeTruthy();
      expect(buyerInitiatedOffer.creator).toEqual(OfferCreator.Buyer);
    });
    test("Seller commits to the offer, no seller param", async () => {
      // check buyer funds before the exchange
      let [buyerFunds] = await buyerCoreSDK.getFunds({
        fundsFilter: {
          accountId: buyerInitiatedOffer.buyerId,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(buyerFunds).toBeTruthy();
      expect(buyerFunds.availableAmount).toEqual(buyerInitiatedOffer.price);

      // check seller funds before the exchange
      let [sellerFunds] = await buyerCoreSDK.getFunds({
        fundsFilter: {
          accountId: seller.id,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(sellerFunds).toBeTruthy();
      expect(sellerFunds.availableAmount).toEqual(drFeeAmount.toString());

      const exchange = await commitToBuyerOffer({
        sellerCoreSDK: sellerCoreSDK,
        offerId: buyerInitiatedOffer.id
      });
      expect(exchange).toBeTruthy();
      expect(exchange.state).toEqual(ExchangeState.COMMITTED);
      expect(exchange.offer).toBeTruthy();
      expect(exchange.offer?.id).toEqual(buyerInitiatedOffer.id);
      expect(exchange.seller).toBeTruthy();
      expect(exchange.seller?.id).toEqual(seller.id);
      expect(exchange.seller?.assistant).toEqual(
        sellerWallet.address.toLowerCase()
      );
      expect(exchange.buyer).toBeTruthy();
      expect(exchange.buyer?.id).toEqual(buyerInitiatedOffer.buyerId);
      expect(exchange.buyer?.wallet).toEqual(buyerWallet.address.toLowerCase());

      // check buyer funds moved from buyer to exchange escrow (offer.price)
      [buyerFunds] = await buyerCoreSDK.getFunds({
        fundsFilter: {
          accountId: buyerInitiatedOffer.buyerId,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(buyerFunds).toBeTruthy();
      expect(buyerFunds.availableAmount).toEqual("0");
      // check buyer funds moved from seller to exchange escrow (drFeeAmount)
      [sellerFunds] = await sellerCoreSDK.getFunds({
        fundsFilter: {
          accountId: seller.id,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(sellerFunds).toBeTruthy();
      expect(sellerFunds.availableAmount).toEqual("0");
      // check seller is now set in the offer object
      buyerInitiatedOffer = await buyerCoreSDK.getOfferById(
        buyerInitiatedOffer.id
      );
      expect(buyerInitiatedOffer.seller).toBeTruthy();
      expect(buyerInitiatedOffer.seller?.id).toEqual(seller.id);
    });
    test("Seller commits to the offer, set offer collection", async () => {
      const collectionId = "MyCollection";
      const tx = await sellerCoreSDK.createNewCollection({
        collectionId,
        contractUri: ""
      });
      await sellerCoreSDK.waitForGraphNodeIndexing(tx);
      const exchange = await commitToBuyerOffer({
        sellerCoreSDK: sellerCoreSDK,
        offerId: buyerInitiatedOffer.id,
        sellerParams: {
          collectionIndex: 1
        }
      });
      expect(exchange).toBeTruthy();
      expect(exchange.offer).toBeTruthy();
      expect(exchange.offer?.id).toEqual(buyerInitiatedOffer.id);
      expect(exchange.offer?.collectionIndex).toEqual("1");
      expect(exchange.offer?.collection).toBeTruthy();
      expect(exchange.offer?.collection?.externalId).toEqual(collectionId);
    });
    test("Seller commits to the offer, set mutualizerAddess", async () => {
      const mutualizerAddress = DR_FEE_MUTUALIZER_ADDRESS;
      // Create the agreement on mutualizer
      const { agreementId } = await newAgreementToDRFeeMutualizer(
        seller.id,
        exchangeToken,
        disputeResolver.id,
        drFeeAmount,
        drFeeAmount,
        3600,
        drFeeAmount,
        false
      );
      // Pay premium to activate the agreement
      await payPremiumToDRFeeMutualizer(
        seedWallet,
        agreementId,
        seller.id,
        exchangeToken,
        drFeeAmount
      );
      // Seller commits
      const exchange = await commitToBuyerOffer({
        sellerCoreSDK: sellerCoreSDK,
        offerId: buyerInitiatedOffer.id,
        sellerParams: {
          mutualizerAddress
        }
      });
      expect(exchange).toBeTruthy();
      expect(exchange.mutualizerAddress).toEqual(
        mutualizerAddress.toLowerCase()
      );
    });
    test("Seller commits to the offer, set royaltyInfo", async () => {
      const treasuryPercentage = "100"; // 1%
      const exchange = await commitToBuyerOffer({
        sellerCoreSDK: sellerCoreSDK,
        offerId: buyerInitiatedOffer.id,
        sellerParams: {
          royaltyInfo: {
            recipients: [constants.AddressZero],
            bps: [treasuryPercentage]
          }
        }
      });
      expect(exchange).toBeTruthy();
      expect(exchange.offer).toBeTruthy();
      expect(exchange.offer.royaltyInfos).toBeTruthy();
      expect(exchange.offer.royaltyInfos.length).toEqual(1);
      expect(exchange.offer.royaltyInfos[0].recipients?.length).toEqual(1);
      expect(
        exchange.offer.royaltyInfos[0].recipients?.[0].recipient.wallet
      ).toEqual(constants.AddressZero);
      expect(exchange.offer.royaltyInfos[0].recipients?.[0].bps).toEqual(
        treasuryPercentage
      );
    });
    test("commitToOffer() fails on buyer initiated offer", async () => {
      await expect(
        commitToOffer({
          buyerCoreSDK: sellerCoreSDK,
          sellerCoreSDK: buyerCoreSDK,
          offerId: buyerInitiatedOffer.id
        })
      ).rejects.toThrow(
        `Offer with id ${buyerInitiatedOffer.id} is not seller initiated`
      );
    });
    test("commitToBuyerOffer() fails on seller initiated offer", async () => {
      const sellerInitiatedOffer = await createOffer(sellerCoreSDK, {
        sellerDeposit: 0,
        price: 0,
        buyerCancelPenalty: 0
      });
      await expect(
        commitToBuyerOffer({
          sellerCoreSDK: buyerCoreSDK,
          offerId: sellerInitiatedOffer.id
        })
      ).rejects.toThrow(
        `Offer with id ${sellerInitiatedOffer.id} is not buyer initiated`
      );
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
