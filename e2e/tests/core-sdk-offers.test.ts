import { Wallet } from "ethers";
import { CoreSDK } from "../../packages/core-sdk/src";
import { ExchangeState } from "../../packages/core-sdk/src/subgraph";
import {
  commitToBuyerOffer,
  commitToOffer,
  createOffer,
  createSeller,
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  seedWallet17
} from "./utils";
import { OfferCreator } from "@bosonprotocol/common/src";

jest.setTimeout(60_000);

const seedWallet = seedWallet17; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-offers", () => {
  describe("buyer initiated offers", () => {
    let buyerCoreSDK: CoreSDK;
    let buyerWallet: Wallet;
    let buyerInitiatedOffer;
    let sellerCoreSDK: CoreSDK;
    let sellerWallet: Wallet;
    let seller;
    beforeEach(async () => {
      ({ sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
        await initSellerAndBuyerSDKs(seedWallet));
      buyerInitiatedOffer = await createOffer(buyerCoreSDK, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 1
      });
      seller = await createSeller(sellerCoreSDK, sellerWallet.address);
      // Buyer needs to deposit offer.price to allow a seller to commit to the offer
      const tx = await buyerCoreSDK.depositFunds(
        buyerInitiatedOffer.buyerId,
        buyerInitiatedOffer.price,
        buyerInitiatedOffer.exchangeToken.address
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
    test("Seller commits to the offer", async () => {
      // check buyer funds before the exchange
      let [buyerFunds] = await buyerCoreSDK.getFunds({
        fundsFilter: {
          accountId: buyerInitiatedOffer.buyerId,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(buyerFunds).toBeTruthy();
      expect(buyerFunds.availableAmount).toEqual(buyerInitiatedOffer.price);

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

      // check buyer funds moved from buyer to exchange escrow
      [buyerFunds] = await buyerCoreSDK.getFunds({
        fundsFilter: {
          accountId: buyerInitiatedOffer.buyerId,
          tokenAddress: buyerInitiatedOffer.exchangeToken.address
        }
      });
      expect(buyerFunds).toBeTruthy();
      expect(buyerFunds.availableAmount).toEqual("0");
      // check seller is now set in the offer object
      buyerInitiatedOffer = await buyerCoreSDK.getOfferById(
        buyerInitiatedOffer.id
      );
      expect(buyerInitiatedOffer.seller).toBeTruthy();
      expect(buyerInitiatedOffer.seller?.id).toEqual(seller.id);
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
    // TODO: add tests with seller sets royaltyInfo, collectionIndex, mutualizerAddress, and check they are saved on the offer
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
