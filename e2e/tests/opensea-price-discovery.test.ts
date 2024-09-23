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
  OfferFieldsFragment
} from "../../packages/core-sdk/src/subgraph";
import {
  Listing,
  Marketplace,
  MarketplaceType,
  Order,
  Wrapper
} from "../../packages/core-sdk/src/marketplaces/types";
import { MSEC_PER_DAY } from "@bosonprotocol/common/src/utils/timestamp";

const seedWallet = seedWallet24;
jest.setTimeout(60_000);

describe("Opensea Price Discovery", () => {
  let sellerCoreSDK: CoreSDK;
  let sellerWallet: Wallet;
  let offer: OfferFieldsFragment;
  let offerId: string;
  let tokenIds: BigNumber[];
  let openseaSdkSeller: Marketplace;
  beforeEach(async () => {
    // Create the sellerCoreSdk
    ({ coreSDK: sellerCoreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet));

    // Create the seller
    await createSeller(sellerCoreSDK, sellerWallet.address);

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
    await (
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
    tokenIndex = 0,
    assetContract: string | undefined = undefined,
    wrapperContract: string | undefined = undefined
  ): Listing => {
    return {
      offerer,
      asset: {
        contract: assetContract || offer.collection.collectionContract.address,
        tokenId: tokenIds[0].add(tokenIndex).toString()
      },
      exchangeToken: {
        address: offer.exchangeToken.address,
        decimals: Number(offer.exchangeToken.decimals)
      },
      price,
      auction: true,
      expirationTime: Math.floor((Date.now() + MSEC_PER_DAY * 1) / 1000),
      zone: wrapperContract || defaultConfig.contracts.priceDiscoveryClient // Workaround to avoid Zone verification on Seaport
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

  const wrapVouchers = async (
    voucherContract: string,
    wrapperAddress: string,
    tokenIds: string[]
  ) => {
    // Ensure the seller approve wrapper for all voucher tokens to allow wrapping
    await approveIfNeeded(wrapperAddress, voucherContract, sellerCoreSDK);
    // Wrap all vouchers
    const wrapTx = await openseaSdkSeller.wrapVouchers(
      voucherContract,
      tokenIds
    );
    await wrapTx.wait();
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
    let openseaSdkBuyer: Marketplace;
    let listing: Listing;
    let buyerWallet: Wallet;
    let buyerCoreSDK: CoreSDK;
    let exchangeId: BigNumber;
    beforeEach(async () => {
      // Buyer creates a bid order for a voucher
      ({ coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet));

      openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      listing = getListing(buyerWallet.address);
      await ensureMintedAndAllowedTokens([buyerWallet], listing.price, false);
      await openseaSdkBuyer.createBidOrder(listing);

      ({ exchangeId } = sellerCoreSDK.parseTokenId(listing.asset.tokenId));
    });
    test("Fulfil a bid offer", async () => {
      let exchange = await sellerCoreSDK.getExchangeById(exchangeId);
      expect(exchange).not.toBeTruthy();

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
      const fulfilmentData = await openseaSdkSeller.generateFulfilmentData(
        listing.asset
      );
      const txCommit = await sellerCoreSDK.commitToPriceDiscoveryOffer(
        buyerWallet.address,
        listing.asset.tokenId,
        fulfilmentData
      );
      await txCommit.wait();
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

  describe("Seller - Use wrappers for pre-minted vouchers", () => {
    test("Seller wraps vouchers", async () => {
      const voucherContract = offer.collection.collectionContract.address;
      {
        const { wrapped, wrapper: wrapperAddress } =
          await openseaSdkSeller.isVoucherWrapped(
            voucherContract,
            tokenIds[0].toString()
          );
        expect(wrapped).toBe(false);
        expect(wrapperAddress).toBeFalsy();
      }
      const wrapper =
        await openseaSdkSeller.getOrCreateVouchersWrapper(voucherContract);
      for (const tokenId of tokenIds) {
        const { wrapped, wrapper: wrapperAddress } =
          await openseaSdkSeller.isVoucherWrapped(
            voucherContract,
            tokenId.toString()
          );
        expect(wrapped).toBe(false);
        expect(wrapperAddress).toBeTruthy();
        expect(wrapperAddress?.toLowerCase()).toEqual(
          wrapper.address.toLowerCase()
        );
        // Before wrapping, the voucher is owned by the Seller
        const tokenOwner = await sellerCoreSDK.erc721OwnerOf({
          contractAddress: voucherContract,
          tokenId
        });
        expect(tokenOwner.toLowerCase()).toEqual(
          sellerWallet.address.toLowerCase()
        );
      }
      // Wrap the vouchers
      await wrapVouchers(
        voucherContract,
        wrapper.address,
        tokenIds.map((bn) => bn.toString())
      );
      for (const tokenId of tokenIds) {
        const { wrapped, wrapper: wrapperAddress } =
          await openseaSdkSeller.isVoucherWrapped(
            voucherContract,
            tokenId.toString()
          );
        expect(wrapped).toBe(true);
        expect(wrapperAddress).toBeTruthy();
        expect(wrapperAddress?.toLowerCase()).toEqual(
          wrapper.address.toLowerCase()
        );
        // The new owner of the real token is now the wrapper contract
        const tokenOwner = await sellerCoreSDK.erc721OwnerOf({
          contractAddress: voucherContract,
          tokenId
        });
        expect(tokenOwner.toLowerCase()).toEqual(wrapper.address.toLowerCase());
        // The owner of the wrapped token is the seller
        const wrappedTokenOwner = await sellerCoreSDK.erc721OwnerOf({
          contractAddress: wrapper.address,
          tokenId
        });
        expect(wrappedTokenOwner.toLowerCase()).toEqual(
          sellerWallet.address.toLowerCase()
        );
      }
    });
    test("Seller unwrap wrapped vouchers", async () => {
      const voucherContract = offer.collection.collectionContract.address;
      const wrapper =
        await openseaSdkSeller.getOrCreateVouchersWrapper(voucherContract);
      // Wrap the vouchers
      await wrapVouchers(
        voucherContract,
        wrapper.address,
        tokenIds.map((bn) => bn.toString())
      );
      for (const tokenId of tokenIds) {
        // Unwrap the voucher
        await openseaSdkSeller.unwrapVoucher(
          voucherContract,
          tokenId.toString()
        );
        // The owner of the real token is now back the seller
        const tokenOwner = await sellerCoreSDK.erc721OwnerOf({
          contractAddress: voucherContract,
          tokenId
        });
        expect(tokenOwner.toLowerCase()).toEqual(
          sellerWallet.address.toLowerCase()
        );
        // The wrapped token has been burnt
        await expect(
          sellerCoreSDK.erc721OwnerOf({
            contractAddress: wrapper.address,
            tokenId
          })
        ).rejects.toThrow(/ERC721: invalid token ID/);
      }
    });
  });

  describe("Seller - Fulfil a bid offer (with wrapper)", () => {
    let voucherContract: string;
    let wrapper: Wrapper;
    let openseaSdkBuyer: Marketplace;
    let listing: Listing;
    let buyerWallet: Wallet;
    let buyerCoreSDK: CoreSDK;
    let exchangeId: BigNumber;
    beforeEach(async () => {
      voucherContract = offer.collection.collectionContract.address;
      wrapper =
        await openseaSdkSeller.getOrCreateVouchersWrapper(voucherContract);
      // Seller Wraps the vouchers
      await wrapVouchers(
        voucherContract,
        wrapper.address,
        tokenIds.map((bn) => bn.toString())
      );
      // Buyer creates a bid order on a wrapped voucher
      ({ coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet));

      openseaSdkBuyer = buyerCoreSDK.marketplace(
        MarketplaceType.OPENSEA,
        createOpenseaSdk(buyerWallet.privateKey),
        OPENSEA_FEE_RECIPIENT
      );

      listing = getListing(
        buyerWallet.address,
        "1000000000000000000",
        0,
        wrapper.address,
        wrapper.address
      );
      await ensureMintedAndAllowedTokens([buyerWallet], listing.price, false);
      await openseaSdkBuyer.createBidOrder(listing);

      ({ exchangeId } = sellerCoreSDK.parseTokenId(listing.asset.tokenId));
    });
    test("Seller can't fulfil the bid offer calling the wrapper outside of Boson Protocol", async () => {
      // Ensure all wrapped vouchers are approved for the wrapper contract
      await approveIfNeeded(
        wrapper.address,
        listing.asset.contract,
        sellerCoreSDK
      );
      // Call finalizeAuction directly by the seller should fail
      await expect(
        openseaSdkSeller.finalizeAuction({
          contract: voucherContract,
          tokenId: listing.asset.tokenId
        })
      ).rejects.toThrow(
        /OpenSeaWrapper: Only unwrapperAddress can finalize auction/
      );
    });
    test("Seller can't fulfil a bid offer on the wrapped voucher not using the wrapper", async () => {
      // Ensure all vouchers are approved for Boson Protocol
      await approveIfNeeded(
        sellerCoreSDK.contracts?.protocolDiamond as string,
        listing.asset.contract,
        sellerCoreSDK
      );
      // Generate fulfilmentData without wrapper
      const fulfilmentData = await openseaSdkSeller.generateFulfilmentData(
        listing.asset
      );
      // Call commitToPriceDiscoveryOffer should fail, because the seller does not own the voucher anymore
      await expect(
        sellerCoreSDK.commitToPriceDiscoveryOffer(
          buyerWallet.address,
          listing.asset.tokenId,
          fulfilmentData
        )
      ).rejects.toThrow(/ERC721: caller is not token owner or approved/);
    });
    test("Seller can't fulfil a bid offer on the unwrapped voucher once been wrapped", async () => {
      // Buyer creates a Bid Offer for the unwrapped token
      const unwrappedListing = getListing(buyerWallet.address);
      await ensureMintedAndAllowedTokens(
        [buyerWallet],
        unwrappedListing.price,
        false
      );
      await openseaSdkBuyer.createBidOrder(unwrappedListing);
      // Ensure all vouchers are approved for Boson Protocol
      await approveIfNeeded(
        sellerCoreSDK.contracts?.protocolDiamond as string,
        unwrappedListing.asset.contract,
        sellerCoreSDK
      );
      // Generate fulfilmentData without wrapper
      const fulfilmentData = await openseaSdkSeller.generateFulfilmentData(
        unwrappedListing.asset
      );
      // Call commitToPriceDiscoveryOffer should fail, because the seller does not own the voucher anymore
      await expect(
        sellerCoreSDK.commitToPriceDiscoveryOffer(
          buyerWallet.address,
          unwrappedListing.asset.tokenId,
          fulfilmentData
        )
      ).rejects.toThrow(/ERC721: caller is not token owner or approved/);
    });
    test("Fulfil a bid offer", async () => {
      // Before, the exchange does not exist
      let exchange = await sellerCoreSDK.getExchangeById(exchangeId);
      expect(exchange).not.toBeTruthy();

      // Check the wrapped voucher belongs to the seller wallet
      let owner = await sellerCoreSDK.erc721OwnerOf({
        contractAddress: wrapper.address,
        tokenId: listing.asset.tokenId
      });
      expect(owner.toLowerCase()).toEqual(sellerWallet.address.toLowerCase());
      // Ensure all wrapped vouchers are approved for the wrapper contract
      await approveIfNeeded(
        wrapper.address,
        listing.asset.contract,
        sellerCoreSDK
      );
      // Call commitToPriceDiscoveryOffer, that will fulfil the Order on Seaport
      const fulfilmentData = await openseaSdkSeller.generateFulfilmentData({
        contract: voucherContract,
        tokenId: listing.asset.tokenId,
        withWrapper: true
      });
      const txCommit = await sellerCoreSDK.commitToPriceDiscoveryOffer(
        buyerWallet.address,
        listing.asset.tokenId,
        fulfilmentData
      );
      await txCommit.wait();
      // Check the voucher has been transferred to the buyer
      owner = await sellerCoreSDK.erc721OwnerOf({
        contractAddress: voucherContract,
        tokenId: listing.asset.tokenId
      });
      expect(owner.toLowerCase()).toEqual(buyerWallet.address.toLowerCase());
      // Check the COMMITTED exchange is created
      await sellerCoreSDK.waitForGraphNodeIndexing(txCommit);
      exchange = await sellerCoreSDK.getExchangeById(exchangeId);
      expect(exchange).toBeTruthy();
      expect(exchange.buyer.wallet.toLowerCase()).toEqual(
        buyerWallet.address.toLowerCase()
      );
      expect(exchange.state).toEqual(ExchangeState.COMMITTED);
    });
  });
});
