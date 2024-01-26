import {
  createBundleMultiVariantOffers,
  createBundleOffer,
  createOffer2,
  createOfferArgs,
  createOfferBatch,
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  mockNFTItem,
  mockProductV1Item,
  mockProductV1Metadata,
  prepareMultiVariantOffers,
  seedWallet22,
  voidOfferBatch
} from "./utils";
import { MetadataType, subgraph } from "../../packages/core-sdk/src";
import {
  productV1Item,
  buildUuid,
  productV1
} from "../../packages/metadata/src";
import nftItemValidFull from "../../packages/metadata/tests/nft-item/valid/full.json";

jest.setTimeout(120_000);

const seedWallet = seedWallet22; // be sure the seedWallet is not used by another test (to allow concurrent run)

const productVariations: productV1.ProductV1Variant[] = [
  [
    {
      type: "Size",
      option: "S"
    }
  ],
  [
    {
      type: "Size",
      option: "M"
    }
  ],
  [
    {
      type: "Size",
      option: "L"
    }
  ]
];

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
  test("Create a BUNDLE with only one physical item", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productV1Item = mockProductV1Item();

    const offer = await createBundleOffer(coreSDK, sellerWallet, [
      productV1Item
    ]);
    expect(offer).toBeTruthy();
    console.log("created offer", offer.id);

    const bundles = await coreSDK.getBundleMetadataEntities({
      metadataFilter: {
        offer_in: [offer.id]
      }
    });
    expect(bundles.length).toEqual(1);
    expect(bundles[0].offer.id).toEqual(offer.id);
    expect(bundles[0].items.length).toEqual(1);

    expect(bundles[0].items[0].type).toEqual(
      subgraph.ItemMetadataType.ItemProductV1
    );
    expect(
      (bundles[0].items[0] as subgraph.ProductV1ItemMetadataEntity).productUuid
    ).toEqual(productV1Item.product.uuid);
  });
  test("Create a BUNDLE with only one digital item", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const digitalItem = mockNFTItem({
      ...nftItemValidFull,
      attributes: nftItemValidFull.attributes.map((attr) => {
        return {
          value: attr.value,
          traitType: (attr["traitType"] || attr["trait_type"]) as string,
          displayType: attr["displayType"] || attr["display_type"]
        }
      }),
      type: MetadataType.ITEM_NFT
    });

    const offer = await createBundleOffer(coreSDK, sellerWallet, [digitalItem]);
    expect(offer).toBeTruthy();
    console.log("created offer", offer.id);

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
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).animationUrl
    ).toEqual(digitalItem.animationUrl);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).youtubeUrl
    ).toEqual(digitalItem.youtubeUrl);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).chainId
    ).toEqual(digitalItem.chainId);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).contract
    ).toEqual(digitalItem.contract);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).quantity
    ).toEqual(digitalItem.quantity);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).tokenId
    ).toEqual(digitalItem.tokenId);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).transferMethod
    ).toEqual(digitalItem.transferMethod);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).transferDelay
    ).toEqual(digitalItem.transferDelay);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).tokenIdRange
    ).toBeTruthy();
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).tokenIdRange?.min
    ).toEqual(digitalItem.tokenIdRange?.min);
    expect(
      (bundles[0].items[0] as subgraph.NftItemMetadataEntity).tokenIdRange?.max
    ).toEqual(digitalItem.tokenIdRange?.max);
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

    const productUuid = buildUuid();
    const [offer_S, offer_M, offer_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid,
      productVariations
    );
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
  test("Create a BUNDLE that contains a multi-variant product already listed as single offer", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    // Create a multi-variant product (without bundle)
    const { offerArgs, productUuid, variations } =
      await prepareMultiVariantOffers(coreSDK, productVariations);

    const createdOffers = await createOfferBatch(
      coreSDK,
      sellerWallet,
      offerArgs
    );
    expect(createdOffers.length).toEqual(productVariations.length);

    // Create a multi-variant bundle with the same productUuid
    const bundleOffers = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid,
      productVariations
    );
    expect(bundleOffers.length).toEqual(productVariations.length);

    const product = await coreSDK.getProductWithVariants(
      seller.id,
      productUuid
    );
    expect(product).toBeTruthy();
    expect(product?.product).toBeTruthy();
    expect(product?.product.uuid).toEqual(productUuid);
    // We expect to have 3 bundles referenced for this product
    expect(product?.bundles.length).toEqual(productVariations.length);
    // We expect to find 6 variants (as there are 6 offers for the same product)
    expect(product?.variants.length).toEqual(2 * productVariations.length);
    for (const offer of [...createdOffers, ...bundleOffers]) {
      expect(
        product?.variants.some((variant) => variant.offer.id === offer.id)
      ).toBe(true);
    }
  });
  test("Create different multi-variant BUNDLES - check getAllProductsWithVariants()", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productUuid1 = buildUuid();
    const [offer1_S, offer1_M, offer1_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid1,
      productVariations
    );
    const productUuid2 = buildUuid();
    const [offer2_S, offer2_M, offer2_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid2,
      productVariations
    );
    for (const offer of [
      offer1_S,
      offer1_M,
      offer1_L,
      offer2_S,
      offer2_M,
      offer2_L
    ]) {
      expect(offer).toBeTruthy();
    }

    // Get all products from current seller
    const allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
      productsFilter: {
        sellerId: seller.id
      }
    });
    expect(allProductsWithVariants.length).toEqual(2);
    expect(
      allProductsWithVariants.some((product) => product.uuid === productUuid1)
    ).toBe(true);
    expect(
      allProductsWithVariants.some((product) => product.uuid === productUuid2)
    ).toBe(true);
    for (let i = 0; i < allProductsWithVariants.length; i++) {
      expect(allProductsWithVariants[i].variants).toBeTruthy();
      expect(allProductsWithVariants[i].variants?.length).toEqual(3);
      expect(allProductsWithVariants[i].allVariantsVoided).toBe(false);
    }
  });
  test("Create different multi-variant BUNDLES - check getAllProductsWithNotVoidedVariants() - no voided offer", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productUuid1 = buildUuid();
    const [offer1_S, offer1_M, offer1_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid1,
      productVariations
    );
    const productUuid2 = buildUuid();
    const [offer2_S, offer2_M, offer2_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid2,
      productVariations
    );
    for (const offer of [
      offer1_S,
      offer1_M,
      offer1_L,
      offer2_S,
      offer2_M,
      offer2_L
    ]) {
      expect(offer).toBeTruthy();
    }

    // Get all products from current seller
    const allProductsWithNotVoidedVariants =
      await coreSDK.getAllProductsWithNotVoidedVariants({
        productsFilter: {
          sellerId: seller.id
        }
      });
    expect(allProductsWithNotVoidedVariants.length).toEqual(2);
    expect(
      allProductsWithNotVoidedVariants.some(
        (product) => product.uuid === productUuid1
      )
    ).toBe(true);
    expect(
      allProductsWithNotVoidedVariants.some(
        (product) => product.uuid === productUuid2
      )
    ).toBe(true);
    for (let i = 0; i < allProductsWithNotVoidedVariants.length; i++) {
      expect(
        allProductsWithNotVoidedVariants[i].notVoidedVariants
      ).toBeTruthy();
      expect(
        allProductsWithNotVoidedVariants[i].notVoidedVariants?.length
      ).toEqual(3);
      expect(allProductsWithNotVoidedVariants[i].allVariantsVoided).toBe(false);
    }
  });
  test("Create different multi-variant BUNDLES - check getAllProductsWithNotVoidedVariants() - some voided offer", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productUuid1 = buildUuid();
    const [offer1_S, offer1_M, offer1_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid1,
      productVariations
    );
    const productUuid2 = buildUuid();
    const [offer2_S, offer2_M, offer2_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid2,
      productVariations
    );
    for (const offer of [
      offer1_S,
      offer1_M,
      offer1_L,
      offer2_S,
      offer2_M,
      offer2_L
    ]) {
      expect(offer).toBeTruthy();
    }
    // Void offer1_S and offer2_L
    await voidOfferBatch(coreSDK, [offer1_S.id, offer2_L.id]);

    // Get all products from current seller
    const allProductsWithNotVoidedVariants =
      await coreSDK.getAllProductsWithNotVoidedVariants({
        productsFilter: {
          sellerId: seller.id
        }
      });
    expect(allProductsWithNotVoidedVariants.length).toEqual(2);
    expect(
      allProductsWithNotVoidedVariants.some(
        (product) => product.uuid === productUuid1
      )
    ).toBe(true);
    expect(
      allProductsWithNotVoidedVariants.some(
        (product) => product.uuid === productUuid2
      )
    ).toBe(true);
    for (let i = 0; i < allProductsWithNotVoidedVariants.length; i++) {
      expect(
        allProductsWithNotVoidedVariants[i].notVoidedVariants
      ).toBeTruthy();
      expect(
        allProductsWithNotVoidedVariants[i].notVoidedVariants?.length
      ).toEqual(2);
      expect(allProductsWithNotVoidedVariants[i].allVariantsVoided).toBe(false);
    }
  });
  test("Create different multi-variant BUNDLES - check getAllProductsWithNotVoidedVariants() - all offers voided", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const productUuid1 = buildUuid();
    const [offer1_S, offer1_M, offer1_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid1,
      productVariations
    );
    const productUuid2 = buildUuid();
    const [offer2_S, offer2_M, offer2_L] = await createBundleMultiVariantOffers(
      coreSDK,
      sellerWallet,
      productUuid2,
      productVariations
    );
    for (const offer of [
      offer1_S,
      offer1_M,
      offer1_L,
      offer2_S,
      offer2_M,
      offer2_L
    ]) {
      expect(offer).toBeTruthy();
    }
    // Void all variant offer2_*
    await voidOfferBatch(coreSDK, [offer2_S.id, offer2_M.id, offer2_L.id]);

    // Get all products from current seller
    const allProductsWithNotVoidedVariants =
      await coreSDK.getAllProductsWithNotVoidedVariants({
        productsFilter: {
          sellerId: seller.id
        }
      });
    expect(allProductsWithNotVoidedVariants.length).toEqual(2);
    expect(
      allProductsWithNotVoidedVariants.find(
        (product) => product.uuid === productUuid1
      )?.allVariantsVoided
    ).toBe(false);
    expect(
      allProductsWithNotVoidedVariants.find(
        (product) => product.uuid === productUuid1
      )?.notVoidedVariants?.length
    ).toEqual(3);
    expect(
      allProductsWithNotVoidedVariants.find(
        (product) => product.uuid === productUuid2
      )?.allVariantsVoided
    ).toBe(true);
    expect(
      allProductsWithNotVoidedVariants.find(
        (product) => product.uuid === productUuid2
      )?.notVoidedVariants?.length
    ).toEqual(0);
  });
});
