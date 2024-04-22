import { Wallet, BigNumber } from "ethers";
import { CoreSDK } from "../../packages/core-sdk/src";
import {
  MOCK_ERC20_ADDRESS,
  OPENSEA_FEE_RECIPIENT,
  approveIfNeeded,
  createOffer,
  createOpenseaSdk,
  createSeller,
  defaultConfig,
  ensureMintedAndAllowedTokens,
  initCoreSDKWithFundedWallet,
  seedWallet24
} from "./utils";
import { PriceType, Side } from "@bosonprotocol/common/src";
import {
  ExchangeState,
  OfferFieldsFragment,
  SellerFieldsFragment
} from "../../packages/core-sdk/src/subgraph";
import {
  Listing,
  Marketplace,
  MarketplaceType,
  Order
} from "../../packages/core-sdk/src/marketplaces/types";
import { MSEC_PER_DAY } from "@bosonprotocol/common/src/utils/timestamp";

const seedWallet = seedWallet24;
jest.setTimeout(60_000);

describe("Opensea Price Discovery", () => {
  let sellerCoreSDK: CoreSDK;
  let sellerWallet: Wallet;
  let seller: SellerFieldsFragment;
  let offer: OfferFieldsFragment;
  let offerId: string;
  let tokenIds: BigNumber[];
  let openseaSdkSeller: Marketplace;
  beforeEach(async () => {
    // Create the sellerCoreSdk
    ({ coreSDK: sellerCoreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet));

    // Create the seller
    seller = await createSeller(sellerCoreSDK, sellerWallet.address);

    // Create a price discovery offer
    offer = await createOffer(sellerCoreSDK, {
      exchangeToken: MOCK_ERC20_ADDRESS, // Should be WETH
      price: "0", // Should be 0 for Price Discovery
      priceType: PriceType.Discovery,
      sellerDeposit: "0",
      buyerCancelPenalty: "0"
    });
    offerId = offer.id;

    // Reserve range
    (
      await sellerCoreSDK.reserveRange(
        offerId,
        offer.quantityAvailable,
        "seller"
      )
    ).wait();
    // Premint some vouchers
    const txPremint = await sellerCoreSDK.preMint(
      offerId,
      offer.quantityAvailable
    );
    await sellerCoreSDK.waitForGraphNodeIndexing(txPremint);
    offer = await sellerCoreSDK.getOfferById(offerId);
    const rangeStartEx = offer.range?.start as string;
    const rangeStartTokenId = sellerCoreSDK.getExchangeTokenId(
      rangeStartEx,
      offerId
    );
    const rangeEndEx = offer.range?.end as string;
    const rangeEndTokenId = sellerCoreSDK.getExchangeTokenId(
      rangeEndEx,
      offerId
    );
    tokenIds = [];
    for (
      let tokenId = rangeStartTokenId;
      tokenId.lte(rangeEndTokenId);
      tokenId = tokenId.add(1)
    ) {
      tokenIds.push(tokenId);
    }
    expect(tokenIds.length).toEqual(Number(offer.quantityInitial));
    expect(Number(offer.quantityAvailable)).toEqual(0);

    openseaSdkSeller = sellerCoreSDK.marketplace(
      MarketplaceType.OPENSEA,
      createOpenseaSdk(sellerWallet.privateKey),
      OPENSEA_FEE_RECIPIENT
    );
  });

  const getListing = (
    offerer: string,
    price = "1000000000000000000",
    tokenIndex = 0
  ): Listing => {
    return {
      offerer,
      asset: {
        contract: offer.collection.collectionContract.address,
        tokenId: tokenIds[0].add(tokenIndex).toString()
      },
      exchangeToken: {
        address: offer.exchangeToken.address,
        decimals: Number(offer.exchangeToken.decimals)
      },
      price,
      auction: true,
      expirationTime: Math.floor((Date.now() + MSEC_PER_DAY * 1) / 1000),
      zone: defaultConfig.contracts.priceDiscoveryClient // Workaround to avoid Zone verification on Seaport
    };
  };

  const checkOrderVSListing = (order: Order, listing: Listing) => {
    expect(order.offerer.toLowerCase()).toEqual(listing.offerer.toLowerCase());
    expect(order.contract.toLowerCase()).toEqual(
      listing.asset.contract.toLowerCase()
    );
    expect(order.exchangeToken.address.toLowerCase()).toEqual(
      listing.exchangeToken.address.toLowerCase()
    );
    expect(order.price).toEqual(listing.price);
    expect(order.endTime).toEqual(listing.expirationTime);
    expect(order.maker.address.toLowerCase()).toEqual(
      listing.offerer.toLowerCase()
    );
  };

  describe("Seller- List pre-minted vouchers (without wrapper)", () => {
    test("Seller creates a listing for 1st voucher", async () => {
      const listing = getListing(sellerWallet.address);
      const order = await openseaSdkSeller.createListing(listing);
      expect(order).toBeTruthy();
      expect(order.side).toEqual(Side.Ask);
      checkOrderVSListing(order, listing);
    });
  });

  describe("Buyer - Create a Bid", () => {
    test("Buyer creates a bid order for 1st voucher but doesn't have the amount needed", async () => {
      const { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);

      const openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      const listing = getListing(buyerWallet.address);
      await expect(openseaSdkBuyer.createBidOrder(listing)).rejects.toThrow(
        /The offerer does not have the amount needed to create or fulfill/
      );
    });
    test("Buyer creates a bid order for 1st voucher", async () => {
      const { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);

      const openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      const listing = getListing(buyerWallet.address);

      // Fund the buyer in ERC20 token, but do not approve
      //  (as we expect commitToOffer to do it when required)
      await ensureMintedAndAllowedTokens([buyerWallet], listing.price, false);

      const order = await openseaSdkBuyer.createBidOrder(listing);
      expect(order).toBeTruthy();
      expect(order.side).toEqual(Side.Bid);
      checkOrderVSListing(order, listing);
    });
  });

  describe("Get Orders", () => {
    test("Get ASK Order", async () => {
      const listing = getListing(sellerWallet.address);
      await openseaSdkSeller.createListing(listing);

      const order = await openseaSdkSeller.getOrder(listing.asset, Side.Ask);
      expect(order).toBeTruthy();
      expect(order.orderHash).toBeTruthy();
      expect(order.side).toEqual(Side.Ask);
      checkOrderVSListing(order, listing);

      await expect(
        openseaSdkSeller.getOrder(listing.asset, Side.Bid)
      ).rejects.toThrow(/Not found: no matching order found/);
    });
    test("Get BID Order", async () => {
      const { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);

      const openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      const listing = getListing(buyerWallet.address);
      await ensureMintedAndAllowedTokens([buyerWallet], listing.price, false);
      await openseaSdkBuyer.createBidOrder(listing);

      const order = await openseaSdkBuyer.getOrder(listing.asset, Side.Bid);
      expect(order.side).toEqual(Side.Bid);
      expect(order.orderHash).toBeTruthy();
      expect(order.signature).toBeTruthy();
      checkOrderVSListing(order, listing);

      await expect(
        openseaSdkSeller.getOrder(listing.asset, Side.Ask)
      ).rejects.toThrow(/Not found: no matching order found/);
    });
  });
  describe("Seller - Fulfil a bid offer (without wrapper)", () => {
    test("Fulfil a bid offer", async () => {
      const { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);

      const openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      const listing = getListing(buyerWallet.address);
      await ensureMintedAndAllowedTokens([buyerWallet], listing.price, false);
      await openseaSdkBuyer.createBidOrder(listing);

      const { exchangeId } = sellerCoreSDK.parseTokenId(listing.asset.tokenId);
      let exchange = await sellerCoreSDK.getExchangeById(exchangeId);
      expect(exchange).not.toBeTruthy();

      const fulfilmentData = await openseaSdkSeller.generateFulfilmentData(
        listing.asset
      );
      // Check the voucher belongs to the seller wallet
      let owner = await sellerCoreSDK.erc721OwnerOf({
        contractAddress: listing.asset.contract,
        tokenId: listing.asset.tokenId
      });
      expect(owner.toLowerCase()).toEqual(sellerWallet.address.toLowerCase());
      // Ensure all vouchers are approved for Boson Protocol
      await approveIfNeeded(
        sellerCoreSDK.contracts?.protocolDiamond as string,
        listing.asset.contract,
        sellerCoreSDK
      );
      // Call commitToPriceDiscoveryOffer, that will fulfil the Order on Seaport
      const txCommit = await sellerCoreSDK.commitToPriceDiscoveryOffer(
        buyerWallet.address,
        listing.asset.tokenId,
        fulfilmentData
      );
      txCommit.wait();
      // Check the token has been transferred to the buyer
      owner = await sellerCoreSDK.erc721OwnerOf({
        contractAddress: listing.asset.contract,
        tokenId: listing.asset.tokenId
      });
      expect(owner.toLowerCase()).toEqual(buyerWallet.address.toLowerCase());
      await sellerCoreSDK.waitForGraphNodeIndexing(txCommit);
      // Check the COMMITTED exchange is created
      exchange = await sellerCoreSDK.getExchangeById(exchangeId);
      expect(exchange).toBeTruthy();
      expect(exchange.buyer.wallet.toLowerCase()).toEqual(
        buyerWallet.address.toLowerCase()
      );
      expect(exchange.state).toEqual(ExchangeState.COMMITTED);
    });
  });
});
