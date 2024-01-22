import { parseEther } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "ethers";
import { NftItem } from "@bosonprotocol/metadata/src/nftItem";
import {
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  mockProductV1Item,
  seedWallet22,
  waitForGraphNodeIndexing
} from "./utils";
import { CoreSDK, MetadataType } from "../../packages/core-sdk/src";
import { bundle } from "@bosonprotocol/metadata/src";
import bundleMetadataMinimal from "../../packages/metadata/tests/bundle/valid/minimal.json";
import {
  AdditionalOfferMetadata,
  CreateOfferArgs
} from "../../packages/core-sdk/src/offers";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import { productV1Item } from "@bosonprotocol/metadata";
import { SEC_PER_DAY } from "@bosonprotocol/common/src/utils/timestamp";

jest.setTimeout(120_000);

const seedWallet = seedWallet22; // be sure the seedWallet is not used by another test (to allow concurrent run)

function mockNFTItem(overrides?: Partial<NftItem>): NftItem {
  return {
    schemaUrl: "https://json-schema.org",
    type: MetadataType.ITEM_NFT,
    name: "Boson NFT Wearable",
    ...overrides
  };
}

function mockBundleMetadata(
  itemUrls: string[],
  overrides?: Partial<Omit<bundle.BundleMetadata, "type">>
): bundle.BundleMetadata {
  return {
    ...bundleMetadataMinimal,
    type: MetadataType.BUNDLE,
    items: itemUrls.map((itemUrl) => {
      return { url: itemUrl };
    }),
    ...overrides
  };
}

async function createOfferArgs(
  coreSDK: CoreSDK,
  metadata: bundle.BundleMetadata,
  productV1Item: productV1Item.ProductV1Item,
  offerParams?: Partial<CreateOfferArgs>
): Promise<{
  offerArgs: CreateOfferArgs;
  offerMetadata: AdditionalOfferMetadata;
}> {
  const metadataHash = await coreSDK.storeMetadata(metadata);
  const metadataUri = "ipfs://" + metadataHash;

  const offerArgs = mockCreateOfferArgs({
    metadataHash,
    metadataUri,
    ...offerParams
  });

  const offerMetadata = {
    sellerContactMethod: productV1Item.exchangePolicy.sellerContactMethod,
    disputeResolverContactMethod:
      productV1Item.exchangePolicy.disputeResolverContactMethod,
    escalationDeposit: parseEther("0.01"),
    escalationResponsePeriodInSec: 20 * SEC_PER_DAY,
    sellerTradingName: metadata.seller.name,
    returnPeriodInDays: parseInt(productV1Item.shipping.returnPeriod)
  };

  return { offerArgs, offerMetadata };
}

async function createOffer(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  offerArgs: CreateOfferArgs
) {
  const sellers = await ensureCreatedSeller(sellerWallet);
  const [seller] = sellers;
  // Check the disputeResolver exists and is active
  const disputeResolverId = offerArgs.disputeResolverId;

  const dr = await coreSDK.getDisputeResolverById(disputeResolverId);
  expect(dr).toBeTruthy();
  expect(dr.active).toBe(true);
  expect(
    dr.sellerAllowList.length == 0 || dr.sellerAllowList.indexOf(seller.id) >= 0
  ).toBe(true);
  const createOfferTxResponse = await coreSDK.createOffer(offerArgs);
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing(createOfferTxReceipt);

  return await coreSDK.getOfferById(createdOfferId as string);
}

function resolveDateValidity(offerArgs: CreateOfferArgs) {
  offerArgs.validFromDateInMS = BigNumber.from(offerArgs.validFromDateInMS)
    .add(10000) // to avoid offerData validation error
    .toNumber();
  offerArgs.voucherRedeemableFromDateInMS = BigNumber.from(
    offerArgs.voucherRedeemableFromDateInMS
  )
    .add(10000) // to avoid offerData validation error
    .toNumber();
}

describe("Bundle e2e tests", () => {
  test("Create an Phygital offer with a single physical product", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();
    const digitalItem = mockNFTItem();

    // Publish metadata of the product item, and get the resulting URL
    const productV1ItemHash = await coreSDK.storeMetadata(productV1Item);
    const productV1ItemUri = "ipfs://" + productV1ItemHash;

    // Publish metadata of the digital item, and get the resulting URL
    const digitalItemHash = await coreSDK.storeMetadata(digitalItem);
    const digitalItemUri = "ipfs://" + digitalItemHash;

    const bundleMetadata = mockBundleMetadata([
      productV1ItemUri,
      digitalItemUri
    ]);

    const { offerArgs } = await createOfferArgs(
      coreSDK,
      bundleMetadata,
      productV1Item
    );
    resolveDateValidity(offerArgs);

    const offer = await createOffer(coreSDK, sellerWallet, offerArgs);
    expect(offer).toBeTruthy();
  });
});
