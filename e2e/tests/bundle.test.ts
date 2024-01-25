import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "ethers";
import { NftItem } from "../../packages/metadata/src/nftItem";
import {
  createOffer2,
  createOfferArgs,
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  mockProductV1Item,
  mockProductV1Metadata,
  seedWallet22
} from "./utils";
import { CoreSDK, MetadataType, subgraph } from "../../packages/core-sdk/src";
import bundleMetadataMinimal from "../../packages/metadata/tests/bundle/valid/minimal.json";
import { CreateOfferArgs } from "../../packages/core-sdk/src/offers";
import {
  AnyMetadata,
  productV1Item,
  bundle,
  buildUuid
} from "../../packages/metadata/src";

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
  bundleUuid: string = buildUuid(),
  overrides?: Partial<Omit<bundle.BundleMetadata, "type" | "bundleUuid">>
): bundle.BundleMetadata {
  return {
    ...bundleMetadataMinimal,
    bundleUuid,
    type: MetadataType.BUNDLE,
    items: itemUrls.map((itemUrl) => {
      return { url: itemUrl };
    }),
    ...overrides
  };
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

async function createBundleOffer(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  items: AnyMetadata[]
) {
  const itemUrls = await Promise.all(
    items.map(async (itemMetadata) => {
      const hash = await coreSDK.storeMetadata(itemMetadata);
      return `ipfs://${hash}`;
    })
  );
  const bundleMetadata = mockBundleMetadata(itemUrls);

  const offerArgs = await createOfferArgs(coreSDK, bundleMetadata);
  resolveDateValidity(offerArgs);

  return createOffer2(coreSDK, sellerWallet, offerArgs);
}

describe("Bundle e2e tests", () => {
  test("Create an Phygital offer with a single physical product", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();
    const digitalItem = mockNFTItem();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item,
      digitalItem
    ]);
    expect(offer).toBeTruthy();
    expect(offer.metadata?.type).toEqual(MetadataType.BUNDLE);
    expect((offer.metadata as any)?.items).toBeTruthy();
    expect((offer.metadata as any)?.items?.length).toEqual(2);
  });
  test("Retrieve a Bundle offer from subgraph", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();
    const digitalItem = mockNFTItem();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item,
      digitalItem
    ]);
    expect(offer).toBeTruthy();

    const bundles = await coreSDK.getBundleMetadataEntities({
      metadataFilter: {
        offer_in: [offer.id]
      }
    });
    expect(bundles.length).toEqual(1);
    expect(bundles[0].offer.id).toEqual(offer.id);
    expect(bundles[0].items.length).toEqual(2);

    expect(
      bundles[0].items.some(
        (item) => item.type === subgraph.ItemMetadataType.ItemProductV1
      )
    ).toBe(true);
    const productItemFromSubgraph = bundles[0].items.find(
      (item) => item.type === subgraph.ItemMetadataType.ItemProductV1
    ) as subgraph.ProductV1ItemMetadataEntity;
    expect(productItemFromSubgraph.uuid).toEqual(productV1Item.uuid);
    expect(productItemFromSubgraph.product.uuid).toEqual(
      productV1Item.product.uuid
    );

    expect(
      bundles[0].items.some(
        (item) => item.type === subgraph.ItemMetadataType.ItemNft
      )
    ).toBe(true);
    const nftItemFromSubgraph = bundles[0].items.find(
      (item) => item.type === subgraph.ItemMetadataType.ItemNft
    ) as subgraph.NftItemMetadataEntity;
    expect(nftItemFromSubgraph.name).toEqual(digitalItem.name);
  });
  test("Retrieve the physical product from a bundle in the subgraph", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();
    const digitalItem = mockNFTItem();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item,
      digitalItem
    ]);
    expect(offer).toBeTruthy();

    const products = await coreSDK.getProductV1Products({
      productsFilter: { sellerId: seller.id, uuid: productV1Item.product.uuid }
    });
    expect(products.length).toEqual(1);
    expect(products[0].uuid).toEqual(productV1Item.product.uuid);
  });
  test("Retrieve the physical product with variants from a bundle in the subgraph (single product)", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();
    const digitalItem = mockNFTItem();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item,
      digitalItem
    ]);
    expect(offer).toBeTruthy();

    const product = await coreSDK.getProductWithVariants(
      seller.id,
      productV1Item.product.uuid
    );
    expect(product).toBeTruthy();
    expect(product?.product).toBeTruthy();
    expect(product?.product.uuid).toEqual(productV1Item.product.uuid);
    expect(product?.variants.length).toEqual(1);
    expect(product?.variants[0].offer.id).toEqual(offer.id);
  });
  test("Create a BUNDLE with only one item", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const digitalItem = mockNFTItem();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [digitalItem]);
    expect(offer).toBeTruthy();

    const bundles = await coreSDK.getBundleMetadataEntities({
      metadataFilter: {
        offer_in: [offer.id]
      }
    });
    expect(bundles.length).toEqual(1);
    expect(bundles[0].offer.id).toEqual(offer.id);
    expect(bundles[0].items.length).toEqual(1);

    expect(bundles[0].items[0].type).toEqual(subgraph.ItemMetadataType.ItemNft);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).name
    ).toEqual(digitalItem.name);
  });
  test("Create a BUNDLE with twice the same single product", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item1 = mockProductV1Item();
    const productUuid = productV1Item1.product.uuid;
    const productV1Item2 = JSON.parse(
      JSON.stringify(productV1Item1)
    ) as productV1Item.ProductV1Item;
    expect(productV1Item2.product.uuid).toEqual(productUuid);

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item1,
      productV1Item2
    ]);
    expect(offer).toBeTruthy();

    const bundles = await coreSDK.getBundleMetadataEntities({
      metadataFilter: {
        offer_in: [offer.id]
      }
    });
    expect(bundles.length).toEqual(1);
    expect(bundles[0].offer.id).toEqual(offer.id);
    expect(bundles[0].items.length).toEqual(2);

    const products = await coreSDK.getProductV1Products({
      productsFilter: { sellerId: seller.id, uuid: productUuid }
    });
    expect(products.length).toEqual(1);
    expect(products[0].uuid).toEqual(productUuid);

    const product = await coreSDK.getProductWithVariants(
      seller.id,
      productUuid
    );
    expect(product).toBeTruthy();
    expect(product?.product).toBeTruthy();
    expect(product?.product.uuid).toEqual(productUuid);
    expect(product?.variants.length).toEqual(1);
    expect(product?.variants[0].offer.id).toEqual(offer.id);
    expect(product?.bundles.length).toEqual(1);
  });
  test("Create a multi-variant product in BUNDLEs", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const variations_S = [
      {
        type: "Size",
        option: "S"
      }
    ];
    const variations_M = [
      {
        type: "Size",
        option: "M"
      }
    ];
    const variations_L = [
      {
        type: "Size",
        option: "L"
      }
    ];

    const productV1Item_S = mockProductV1Item(undefined, undefined, {
      variations: variations_S
    });
    const productUuid = productV1Item_S.product.uuid;
    const productV1Item_M = mockProductV1Item(undefined, productUuid, {
      variations: variations_M
    });
    const productV1Item_L = mockProductV1Item(undefined, productUuid, {
      variations: variations_L
    });
    const digitalItem = mockNFTItem();

    const [offer_S, offer_M, offer_L] = await Promise.all([
      await createBundleOffer(coreSDK, sellerWallet, [
        productV1Item_S,
        digitalItem
      ]),
      await createBundleOffer(coreSDK, sellerWallet, [
        productV1Item_M,
        digitalItem
      ]),
      await createBundleOffer(coreSDK, sellerWallet, [
        productV1Item_L,
        digitalItem
      ])
    ]);
    expect(offer_S).toBeTruthy();
    expect(offer_M).toBeTruthy();
    expect(offer_L).toBeTruthy();

    const bundles = await coreSDK.getBundleMetadataEntities({
      metadataFilter: {
        seller_in: [seller.id]
      }
    });
    expect(bundles.length).toEqual(3);
    expect(bundles[0].items.length).toEqual(2);
    expect(bundles[1].items.length).toEqual(2);
    expect(bundles[2].items.length).toEqual(2);

    const products = await coreSDK.getProductV1Products({
      productsFilter: { sellerId: seller.id, uuid: productUuid }
    });
    expect(products.length).toEqual(1);
    expect(products[0].uuid).toEqual(productUuid);

    const product = await coreSDK.getProductWithVariants(
      seller.id,
      productUuid
    );
    expect(product).toBeTruthy();
    expect(product?.product).toBeTruthy();
    expect(product?.product.uuid).toEqual(productUuid);
    expect(product?.variants.length).toEqual(3);
    expect(
      product?.variants.some((variant) => variant.offer.id === offer_S.id)
    ).toBe(true);
    expect(
      product?.variants.some((variant) => variant.offer.id === offer_M.id)
    ).toBe(true);
    expect(
      product?.variants.some((variant) => variant.offer.id === offer_L.id)
    ).toBe(true);
    expect(product?.bundles.length).toEqual(3);
  });
  test("Create a BUNDLE that contains a product already listed as single offer", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;
    const productV1Metadata = mockProductV1Metadata("dummy");
    const productUuid = productV1Metadata.product.uuid;
    const productV1OfferArgs = await createOfferArgs(
      coreSDK,
      productV1Metadata
    );
    const productV1Offer = await createOffer2(
      coreSDK,
      sellerWallet,
      productV1OfferArgs
    );
    expect(productV1Offer).toBeTruthy();
    expect(productV1Offer.metadata).toBeTruthy();
    expect(productV1Offer.metadata?.type).toEqual("PRODUCT_V1");

    const productV1Item1 = mockProductV1Item(undefined, productUuid);
    const digitalItem = mockNFTItem();

    const bundleOffer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item1,
      digitalItem
    ]);
    expect(bundleOffer).toBeTruthy();
    expect(bundleOffer.id).not.toEqual(productV1Offer.id);
    expect(bundleOffer.metadata).toBeTruthy();
    expect(bundleOffer.metadata?.type).toEqual("BUNDLE");

    const products = await coreSDK.getProductV1Products({
      productsFilter: { sellerId: seller.id, uuid: productUuid }
    });
    // We expect to have only one product (as it's the same in both the productV1Offer and the bundleOffer)
    expect(products.length).toEqual(1);
    expect(products[0].uuid).toEqual(productUuid);

    const product = await coreSDK.getProductWithVariants(
      seller.id,
      productUuid
    );
    // TODO; potential changes:
    // - product?.product only returns the physical product, if offered in single way (outside of any bundle)
    // - product?.variant returns the variants of the physical product, if offered in single way (outside of any bundle)
    // - product?.bundles return all bundles containing the given product.
    // - product.bundles[i] should be mapped per bundleUUID (the same bundleUUID value can be shared across several bundles, meaning
    //   each of them is a variant of a multi-variant bundle - should match multi different variants of the physical item(s) and, if any, of digital item(s))
    expect(product).toBeTruthy();
    expect(product?.product).toBeTruthy();
    expect(product?.product.uuid).toEqual(productUuid);
    // We expect to have 1 bundle referenced for this product
    expect(product?.bundles.length).toEqual(1);
    // We expect to find 2 variants (as there are 2 offers for the same product)
    expect(product?.variants.length).toEqual(2);
    expect(
      product?.variants.some(
        (variant) => variant.offer.id === productV1Offer.id
      )
    ).toBe(true);
    expect(
      product?.variants.some((variant) => variant.offer.id === bundleOffer.id)
    ).toBe(true);
  });
});

// TODO: check methods getAllProductsWithNotVoidedVariants() / getAllProductsWithVariants() with BUNDLE offers
