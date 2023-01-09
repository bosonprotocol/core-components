import {
  MSEC_PER_DAY,
  MSEC_PER_HOUR
} from "./../../packages/common/src/utils/timestamp";
import { AdditionalOfferMetadata } from "./../../packages/core-sdk/src/offers/renderContractualAgreement";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import {
  MetadataType,
  productV1,
  validateMetadata
} from "@bosonprotocol/metadata";
import { CreateOfferArgs } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import { Wallet } from "ethers";
import { CoreSDK, subgraph } from "../../packages/core-sdk/src";
import {
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  seedWallet10,
  wait,
  waitForGraphNodeIndexing
} from "./utils";
import productV1ValidMinimalOffer from "../../packages/metadata/tests/product-v1/valid/minimalOffer.json";
import { SEC_PER_DAY } from "@bosonprotocol/common/src/utils/timestamp";

jest.setTimeout(120_000);

const seedWallet = seedWallet10; // be sure the seedWallet is not used by another test (to allow concurrent run)

const MAX_INT32 = Math.pow(2, 31) - 1;

function mockProductV1Metadata(
  template: string,
  productUuid: string = productV1.buildUuid()
): productV1.ProductV1Metadata {
  return {
    ...productV1ValidMinimalOffer,
    product: {
      ...productV1ValidMinimalOffer.product,
      uuid: productUuid
    },
    uuid: productV1.buildUuid(),
    type: MetadataType.PRODUCT_V1,
    exchangePolicy: {
      ...productV1ValidMinimalOffer.exchangePolicy,
      template
    }
  };
}

function serializeVariant(variant: productV1.ProductV1Variant): string {
  // Be sure each variation structure has its keys ordered
  const orderedStruct = variant.map((variation) =>
    Object.keys(variation)
      .sort()
      .reduce((obj, key) => {
        obj[key] = variation[key];
        return obj;
      }, {})
  ) as productV1.ProductV1Variant;
  // Be sure each variation in the table is ordered per type
  const orderedTable = orderedStruct.sort((a, b) =>
    a.type.localeCompare(b.type)
  );
  return JSON.stringify(orderedTable);
}

async function createOfferArgs(
  coreSDK: CoreSDK,
  metadata: productV1.ProductV1Metadata,
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
    sellerContactMethod: metadata.exchangePolicy.sellerContactMethod,
    disputeResolverContactMethod:
      metadata.exchangePolicy.disputeResolverContactMethod,
    escalationDeposit: parseEther("0.01"),
    escalationResponsePeriodInSec: 20 * SEC_PER_DAY,
    sellerTradingName: metadata.seller.name,
    returnPeriodInDays: parseInt(metadata.shipping.returnPeriod)
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

  let offer: subgraph.OfferFieldsFragment | null = null;
  for (let i = 0; i < 3 && !offer; i++) {
    await waitForGraphNodeIndexing();
    offer = await coreSDK.getOfferById(createdOfferId as string);
  }

  return offer;
}

async function createOfferBatch(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  offersArgs: Array<CreateOfferArgs>
) {
  const sellers = await ensureCreatedSeller(sellerWallet);
  const [seller] = sellers;
  for (const offerArgs of offersArgs) {
    // Check the disputeResolver exists and is active
    const disputeResolverId = offerArgs.disputeResolverId;

    const dr = await coreSDK.getDisputeResolverById(disputeResolverId);
    expect(dr).toBeTruthy();
    expect(dr.active).toBe(true);
    expect(
      dr.sellerAllowList.length == 0 ||
        dr.sellerAllowList.indexOf(seller.id) >= 0
    ).toBe(true);
  }
  const createOfferTxResponse = await coreSDK.createOfferBatch(offersArgs);
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferIds = coreSDK.getCreatedOfferIdsFromLogs(
    createOfferTxReceipt.logs
  );

  expect(createdOfferIds.length).toEqual(offersArgs.length);

  let offers: subgraph.OfferFieldsFragment[] = [];
  for (
    let i = 0;
    i < 3 && offers.length < offersArgs.length && createdOfferIds.length > 0;
    i++
  ) {
    offers = [];
    await waitForGraphNodeIndexing();
    const offerPromises = createdOfferIds.map((createdOfferId) =>
      coreSDK.getOfferById(createdOfferId as string)
    );
    offers = await Promise.all(offerPromises);
  }

  // Be sure the returned offers are in the same order as the offersArgs
  // (here we know that the metadataHash is unique for every offer)
  const retOffers: subgraph.OfferFieldsFragment[] = [];
  const offersMap = new Map<string, subgraph.OfferFieldsFragment>();
  for (const offer of offers) {
    offersMap.set(offer.metadataHash, offer);
  }
  for (const offersArg of offersArgs) {
    const offer = offersMap.get(offersArg.metadataHash);
    if (offer) {
      retOffers.push(offer);
    }
  }

  return retOffers;
}

describe("ProductV1 e2e tests", () => {
  test("Create an offer, then render the contractual agreement template", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const template =
      "Hello World!! {{sellerTradingName}} {{disputeResolverContactMethod}} {{sellerContactMethod}} {{returnPeriodInDays}}";
    const metadata = mockProductV1Metadata(template);
    const { offerArgs } = await createOfferArgs(coreSDK, metadata);
    resolveDateValidity(offerArgs);

    const offer = await createOffer(coreSDK, sellerWallet, offerArgs);
    expect(offer).toBeTruthy();
    const render = await coreSDK.renderContractualAgreementForOffer(
      (offer as subgraph.OfferFieldsFragment).id
    );
    expect(render).toEqual(
      `Hello World!! ${metadata.seller.name} ${metadata.exchangePolicy.disputeResolverContactMethod} ${metadata.exchangePolicy.sellerContactMethod} ${metadata.shipping.returnPeriod}`
    );
  });

  test("Prepare an offer, then render the contractual agreement template from createOfferArgs", async () => {
    const coreSDK = initCoreSDKWithWallet(seedWallet);

    const template =
      "Hello World!! {{sellerTradingName}} {{disputeResolverContactMethod}} {{sellerContactMethod}} {{returnPeriodInDays}}";
    const metadata = mockProductV1Metadata(template);
    const { offerArgs, offerMetadata } = await createOfferArgs(
      coreSDK,
      metadata
    );

    const render = await coreSDK.renderContractualAgreement(
      template,
      offerArgs,
      offerMetadata
    );
    expect(render).toEqual(
      `Hello World!! ${metadata.seller.name} ${metadata.exchangePolicy.disputeResolverContactMethod} ${metadata.exchangePolicy.sellerContactMethod} ${metadata.shipping.returnPeriod}`
    );
  });
});

describe("Multi-variant offers tests", () => {
  test("Create a product with 2 variants - not using batch creation", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const [offerArgs1, offerArgs2] = (await prepareMultiVariantOffers(coreSDK))
      .offerArgs;

    // Get the number of offers of this seller before
    const offersFilter = {
      offersFilter: {
        sellerId: seller.id
      }
    };
    const offersBefore = await coreSDK.getOffers(offersFilter);
    expect(offersBefore).toBeTruthy();

    // Get the number of products of this seller before
    const productsFilter = {
      productsFilter: {
        sellerId: seller.id
      }
    };
    const productsBefore = await coreSDK.getProductV1Products(productsFilter);
    expect(productsBefore).toBeTruthy();

    const offer1 = await createOffer(coreSDK, sellerWallet, offerArgs1);
    const offer2 = await createOffer(coreSDK, sellerWallet, offerArgs2);
    expect(offer1).toBeTruthy();
    expect(offer2).toBeTruthy();

    // Check the number of offers of this seller has been increased by 2
    const offersAfter = await coreSDK.getOffers(offersFilter);
    expect(offersAfter).toBeTruthy();
    expect(offersAfter.length).toEqual(offersBefore.length + 2);
    // Check the number of products of this seller has been increased by 1
    const productsAfter = await coreSDK.getProductV1Products(productsFilter);
    expect(productsAfter).toBeTruthy();
    expect(productsAfter.length).toEqual(productsBefore.length + 1);
  });

  test("Create a product with 2 variants - using batch creation", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;

    const [offerArgs1, offerArgs2] = (await prepareMultiVariantOffers(coreSDK))
      .offerArgs;

    // Get the number of offers of this seller before
    const offersFilter = {
      offersFilter: {
        sellerId: seller.id
      }
    };
    const offersBefore = await coreSDK.getOffers(offersFilter);
    expect(offersBefore).toBeTruthy();

    // Get the number of products of this seller before
    const productsFilter = {
      productsFilter: {
        productV1Seller_: {
          sellerId: seller.id
        }
      }
    };
    const productsBefore = await coreSDK.getProductV1Products(productsFilter);
    expect(productsBefore).toBeTruthy();

    const offers = await createOfferBatch(coreSDK, sellerWallet, [
      offerArgs1,
      offerArgs2
    ]);
    expect(offers.length).toEqual(2);

    const [offer1, offer2] = offers;
    expect(offer1).toBeTruthy();
    expect(offer2).toBeTruthy();

    // Check the order of returned offers matches the order of passed args
    expect(offer1.metadataHash).toEqual(offerArgs1.metadataHash);
    expect(offer2.metadataHash).toEqual(offerArgs2.metadataHash);

    // Check the number of offers of this seller has been increased by 2
    const offersAfter = await coreSDK.getOffers(offersFilter);
    expect(offersAfter).toBeTruthy();
    expect(offersAfter.length).toEqual(offersBefore.length + 2);

    // Check the number of products of this seller has been increased by 1
    const productsAfter = await coreSDK.getProductV1Products(productsFilter);
    expect(productsAfter).toBeTruthy();
    expect(productsAfter.length).toEqual(productsBefore.length + 1);
  });

  test("find product by productUUID", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const sellers = await ensureCreatedSeller(sellerWallet);
    const [seller] = sellers;
    const {
      offerArgs: [offerArgs1, offerArgs2],
      productUuid,
      productMetadata
    } = await prepareMultiVariantOffers(coreSDK);

    await createOfferBatch(coreSDK, sellerWallet, [offerArgs1, offerArgs2]);

    const [product] = await coreSDK.getProductV1Products({
      productsFilter: {
        uuid: productUuid
      }
    });

    expect(product).toBeTruthy();
    expect(product.title).toEqual(productMetadata.product.title);
    expect(product.description).toEqual(productMetadata.product.description);
    expect(product.uuid).toEqual(productMetadata.product.uuid);
    expect(product.version).toEqual(productMetadata.product.version);
    expect(product.productV1Seller).toBeTruthy();
    if (product.productV1Seller) {
      expect(product.productV1Seller.name).toEqual(productMetadata.seller.name);
      expect(product.productV1Seller.sellerId).toEqual(seller.id);
    }
  });

  test("find all offers associated with a product", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    await ensureCreatedSeller(sellerWallet);
    const {
      offerArgs: [offerArgs1, offerArgs2],
      productUuid,
      variations: expectedVariations
    } = await prepareMultiVariantOffers(coreSDK);

    const createdOffers = await createOfferBatch(coreSDK, sellerWallet, [
      offerArgs1,
      offerArgs2
    ]);

    // Look for ProductV1MetadataEntities, filtered per productUuid
    const metadataEntities = await coreSDK.getProductV1MetadataEntities({
      metadataFilter: {
        productUuid
      }
    });
    expect(metadataEntities.length).toEqual(2);

    // Get the associated offers
    const foundOffers = metadataEntities.map((m) => m.offer);
    const offerIds = createdOffers.map((offer) => offer.id);

    // Check we have retrieved the 2 created offers (may be returned in any order)
    expect(offerIds.includes(foundOffers[0].id)).toBe(true);
    expect(offerIds.includes(foundOffers[1].id)).toBe(true);

    // Check the variations
    const variations = metadataEntities.map((m) => m.variations);
    const variationsStr = variations
      .map((v) => {
        return v?.map((o) => {
          return { type: o.type, option: o.option };
        });
      })
      .map((v) => (v ? serializeVariant(v) : undefined));
    for (const expectedVariation of expectedVariations) {
      const expStr = serializeVariant(expectedVariation);
      expect(variationsStr.includes(expStr)).toBe(true);
    }
  });
  test("find all offers associated with a product - getProductWithVariants()", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    await ensureCreatedSeller(sellerWallet);
    const {
      offerArgs: [offerArgs1, offerArgs2],
      productMetadata,
      productUuid,
      variations: expectedVariations
    } = await prepareMultiVariantOffers(coreSDK);

    const createdOffers = await createOfferBatch(coreSDK, sellerWallet, [
      offerArgs1,
      offerArgs2
    ]);

    const productWithVariants = await coreSDK.getProductWithVariants(
      productUuid
    );
    expect(productWithVariants).toBeTruthy();

    if (productWithVariants) {
      // Check the product data
      checkProductMetadata(
        productWithVariants.product,
        productMetadata.product
      );

      // // Get the associated offers
      const foundOffers = productWithVariants.variants.map((v) => v.offer);
      const offerIds = createdOffers.map((offer) => offer.id);

      // Check we have retrieved the 2 created offers (may be returned in any order)
      expect(offerIds.includes(foundOffers[0].id)).toBe(true);
      expect(offerIds.includes(foundOffers[1].id)).toBe(true);

      // Check the variations
      const variations = productWithVariants.variants.map((m) => m.variations);
      const variationsStr = variations
        .map((v) => {
          return v?.map((o) => {
            return { type: o.type, option: o.option };
          });
        })
        .map((v) => (v ? serializeVariant(v) : undefined));
      for (const expectedVariation of expectedVariations) {
        const expStr = serializeVariant(expectedVariation);
        expect(variationsStr.includes(expStr)).toBe(true);
      }
    }
  });

  test("check getProductWithVariants() can be used for single variant product", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const productUuid = productV1.buildUuid();
    const template = "Hello World!!";
    const productMetadata = mockProductV1Metadata(template, productUuid);
    const { offerArgs } = await createOfferArgs(coreSDK, productMetadata);
    resolveDateValidity(offerArgs);

    const offer = await createOffer(coreSDK, sellerWallet, offerArgs);
    expect(offer).toBeTruthy();

    const productWithVariants = await coreSDK.getProductWithVariants(
      productUuid
    );
    expect(productWithVariants).toBeTruthy();

    if (productWithVariants) {
      // Check the product data
      checkProductMetadata(
        productWithVariants.product,
        productMetadata.product
      );

      // // Get the associated offers
      const foundOffers = productWithVariants.variants.map((v) => v.offer);

      // Check there is an offer and only one associated to this product
      expect(foundOffers).toBeTruthy();
      expect(foundOffers.length).toEqual(1);
      expect(foundOffers[0].id).toEqual(offer?.id);

      // Check there is an empty variation for this product
      const variations = productWithVariants.variants.map((m) => m.variations);
      expect(variations).toBeTruthy();
      expect(variations.length).toEqual(1);
      expect(variations[0].length).toEqual(0);
    }
  });
  test("check getProductWithVariants() return the offer exchanges", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const productUuid = productV1.buildUuid();
    const template = "Hello World!!";
    const productMetadata = mockProductV1Metadata(template, productUuid);
    // Create an offer with 0 price 0 deposit to make it easier to commit
    const { offerArgs } = await createOfferArgs(coreSDK, productMetadata, {
      price: "0",
      sellerDeposit: "0",
      buyerCancelPenalty: "0"
    });
    resolveDateValidity(offerArgs);

    const offer = await createOffer(coreSDK, sellerWallet, offerArgs);
    expect(offer).toBeTruthy();

    // Wait for the offer to be committable
    while (Date.now() < Number(offer?.validFromDate) * 1000) {
      await wait(500);
    }

    // Commit to the offer
    const commitTx = await coreSDK.commitToOffer(offer?.id as string);
    await commitTx.wait();
    await waitForGraphNodeIndexing();

    const productWithVariants = await coreSDK.getProductWithVariants(
      productUuid
    );
    expect(productWithVariants).toBeTruthy();

    if (productWithVariants) {
      // always true - required by compiler
      // Check the product data
      checkProductMetadata(
        productWithVariants.product,
        productMetadata.product
      );

      // // Get the associated offers
      const foundOffers = productWithVariants.variants.map((v) => v.offer);

      // Check there is an offer and only one associated to this product
      expect(foundOffers).toBeTruthy();
      expect(foundOffers.length).toEqual(1);

      // Check there are exchanges for this offer
      expect(foundOffers[0].exchanges).toBeTruthy();
    }
  });
  describe("Fetch all products with their variants", () => {
    let coreSDK: CoreSDK;
    let sellerWallet: Wallet;
    let seller: subgraph.SellerFieldsFragment;
    let productUuid1, productUuid2: string;
    let nbProductsBefore = 0;
    let offers: subgraph.OfferFieldsFragment[];
    let productsFilter: {
      productsFilter: {
        sellerId_in: string[];
      };
    };

    beforeEach(async () => {
      ({ coreSDK, fundedWallet: sellerWallet } =
        await initCoreSDKWithFundedWallet(seedWallet));
      const sellers = await ensureCreatedSeller(sellerWallet);
      [seller] = sellers;
      let offerArgs1, offerArgs2, offerArgs3, offerArgs4: CreateOfferArgs;

      const offersParams1 = [
        {
          validFromDateInMS: Date.now() + 1000,
          validUntilDateInMS: Date.now() + 1 * MSEC_PER_HOUR + 20 * MSEC_PER_DAY
        },
        {
          validFromDateInMS: Date.now() + 1 * MSEC_PER_HOUR,
          validUntilDateInMS: Date.now() + 20 * MSEC_PER_DAY
        }
      ];
      const offersParams2 = [
        {
          validFromDateInMS: Date.now() + 3 * MSEC_PER_HOUR,
          validUntilDateInMS: Date.now() + 20 * MSEC_PER_DAY
        },
        {
          validFromDateInMS: Date.now() + 2 * MSEC_PER_HOUR,
          validUntilDateInMS: Date.now() + 1 * MSEC_PER_HOUR + 20 * MSEC_PER_DAY
        }
      ];
      ({
        offerArgs: [offerArgs1, offerArgs2],
        productUuid: productUuid1
      } = await prepareMultiVariantOffers(coreSDK, offersParams1));
      ({
        offerArgs: [offerArgs3, offerArgs4],
        productUuid: productUuid2
      } = await prepareMultiVariantOffers(coreSDK, offersParams2));

      // Get the number of offers of this seller before
      const offersFilter = {
        offersFilter: {
          sellerId: seller.id
        }
      };
      const offersBefore = await coreSDK.getOffers(offersFilter);
      expect(offersBefore).toBeTruthy();

      // Get the number of products of this seller before
      productsFilter = {
        productsFilter: {
          sellerId_in: [seller.id]
        }
      };
      const productsBefore = await coreSDK.getAllProductsWithVariants(
        productsFilter
      );
      expect(productsBefore).toBeTruthy();
      nbProductsBefore = productsBefore.length;

      const offerArgsList = [offerArgs1, offerArgs2, offerArgs3, offerArgs4];
      offers = await createOfferBatch(coreSDK, sellerWallet, offerArgsList);
      expect(offers.length).toEqual(offerArgsList.length);
    });

    test("#getAllProductsWithVariants()", async () => {
      // Get the products with all variants
      const allProductsWithVariants = await coreSDK.getAllProductsWithVariants(
        productsFilter
      );
      // Check the number of products of this seller has been increased by 2
      expect(allProductsWithVariants.length).toEqual(nbProductsBefore + 2);

      // Check offer1 and offer2 are listed in the variants of product1
      const productWithVariants1 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid1
      );
      checkProduct(productWithVariants1, "variants", [offers[0], offers[1]]);
      expect(productWithVariants1?.allVariantsVoided).toBe(false);

      // Check offer3 and offer4 are listed in the variants of product2
      const productWithVariants2 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid2
      );
      checkProduct(productWithVariants2, "variants", [offers[2], offers[3]]);
      expect(productWithVariants2?.allVariantsVoided).toBe(false);
    });

    test("#getAllProductsWithVariants() - filter by disputeResolverId", async () => {
      // Get the products with all variants
      let allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          disputeResolverId: "1"
        }
      });

      expect(allProductsWithVariants.length).toBeGreaterThan(0);

      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          disputeResolverId: "2"
        }
      });
      expect(allProductsWithVariants.length).toEqual(0);
    });

    test("#getAllProductsWithNotVoidedVariants()", async () => {
      // Get the products with all variants
      const allProductsWithVariants =
        await coreSDK.getAllProductsWithNotVoidedVariants(productsFilter);
      // Check the number of products of this seller has been increased by 2
      expect(allProductsWithVariants.length).toEqual(nbProductsBefore + 2);

      // Check offer1 and offer2 are listed in the variants of product1
      const productWithVariants1 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid1
      );
      checkProduct(productWithVariants1, "notVoidedVariants", [
        offers[0],
        offers[1]
      ]);
      expect(productWithVariants1?.allVariantsVoided).toBe(false);

      // Check offer3 and offer4 are listed in the variants of product2
      const productWithVariants2 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid2
      );
      checkProduct(productWithVariants2, "notVoidedVariants", [
        offers[2],
        offers[3]
      ]);
      expect(productWithVariants2?.allVariantsVoided).toBe(false);
    });

    test("Check voided offers", async () => {
      // Void the offer1
      const voidTx = await coreSDK.voidOffer(offers[0].id);
      await voidTx.wait();
      await waitForGraphNodeIndexing();

      // Check the notVoidedVariants for product1 only includes the offer2
      let allProductsWithVariants =
        await coreSDK.getAllProductsWithNotVoidedVariants(productsFilter);
      const productWithVariants1 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid1
      );
      checkProduct(productWithVariants1, "notVoidedVariants", [offers[1]]);
      expect(productWithVariants1?.allVariantsVoided).toBe(false);

      // Void the offer3 and offer4
      const batchVoidTx = await coreSDK.voidOfferBatch([
        offers[2].id,
        offers[3].id
      ]);
      await batchVoidTx.wait();
      await waitForGraphNodeIndexing();

      // Check the notVoidedVariants for product2 do not include any offer
      allProductsWithVariants =
        await coreSDK.getAllProductsWithNotVoidedVariants(productsFilter);
      const productWithVariants2 = allProductsWithVariants.find(
        (p) => p.uuid === productUuid2
      );
      expect(productWithVariants2).toBeTruthy();
      expect(productWithVariants2?.allVariantsVoided).toBe(true);
      expect(productWithVariants2?.notVoidedVariants?.length).toEqual(0);

      // Check we have only one product returned using the 'allVariantsVoided' filter
      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          ...productsFilter.productsFilter,
          allVariantsVoided: false
        }
      });
      expect(allProductsWithVariants.length).toEqual(1);
      expect(allProductsWithVariants[0].uuid).toEqual(productUuid1);
    });

    test("Check filtering capacities - validity date", async () => {
      const productsData = buildProductData(offers);
      let allProductsWithVariants: subgraph.BaseProductV1ProductWithVariantsFieldsFragment[];
      let targetDate: string;
      // targetDate is before all offers validity period
      targetDate = BigNumber.from(productsData.minValidFromDate)
        .sub(1)
        .toString();
      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          ...productsFilter.productsFilter,
          minValidFromDate_lte: targetDate,
          maxValidUntilDate_gte: targetDate
        }
      });
      expect(allProductsWithVariants.length).toEqual(0);
      // targetDate is later than all offers validity period
      targetDate = BigNumber.from(productsData.maxValidUntilDate)
        .add(1)
        .toString();
      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          ...productsFilter.productsFilter,
          minValidFromDate_lte: targetDate,
          maxValidUntilDate_gte: targetDate
        }
      });
      expect(allProductsWithVariants.length).toEqual(0);
      // targetDate is between min and max of offers
      targetDate = BigNumber.from(productsData.maxValidFromDate)
        .add(1)
        .toString();
      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          ...productsFilter.productsFilter,
          minValidFromDate_lte: targetDate,
          maxValidUntilDate_gte: targetDate
        }
      });
      expect(allProductsWithVariants.length).toEqual(2);
      // targetDate is in validity period of 1 offer of 1 product only
      targetDate = BigNumber.from(productsData.minValidFromDate)
        .add(1)
        .toString();
      allProductsWithVariants = await coreSDK.getAllProductsWithVariants({
        productsFilter: {
          ...productsFilter.productsFilter,
          minValidFromDate_lte: targetDate,
          maxValidUntilDate_gte: targetDate
        }
      });
      expect(allProductsWithVariants.length).toEqual(1);
    });
  });
});

function checkProduct(
  productWithVariants:
    | subgraph.BaseProductV1ProductWithVariantsFieldsFragment
    | undefined,
  variantsKey: "variants" | "notVoidedVariants",
  offers: subgraph.OfferFieldsFragment[]
) {
  expect(productWithVariants).toBeTruthy();
  expect(productWithVariants?.[variantsKey]?.length).toEqual(offers.length);
  const offerIds = offers.map((offer) => offer.id);
  const productData = buildProductData(offers);
  for (const variant of (productWithVariants as any)[variantsKey]) {
    expect(variant.offer).toBeTruthy();
    expect(offerIds.includes(variant.offer.id)).toBe(true);
  }
  // Check the min/max dates at product level are as expected
  expect(
    BigNumber.from(productWithVariants?.minValidFromDate).eq(
      productData.minValidFromDate
    )
  );
  expect(
    BigNumber.from(productWithVariants?.maxValidFromDate).eq(
      productData.maxValidFromDate
    )
  );
  expect(
    BigNumber.from(productWithVariants?.minValidUntilDate).eq(
      productData.minValidUntilDate
    )
  );
  expect(
    BigNumber.from(productWithVariants?.maxValidUntilDate).eq(
      productData.maxValidUntilDate
    )
  );
}

function buildProductData(offers: subgraph.OfferFieldsFragment[]) {
  const toNumbers = (bnishes: BigNumberish[]) => {
    return bnishes.map((bnish) => BigNumber.from(bnish).toNumber());
  };
  return {
    minValidFromDate: Math.min(
      ...toNumbers(offers.map((offer) => offer.validFromDate))
    ).toString(),
    maxValidFromDate: Math.max(
      ...toNumbers(offers.map((offer) => offer.validFromDate))
    ).toString(),
    minValidUntilDate: Math.min(
      ...toNumbers(offers.map((offer) => offer.validUntilDate))
    ).toString(),
    maxValidUntilDate: Math.max(
      ...toNumbers(offers.map((offer) => offer.validUntilDate))
    ).toString()
  };
}

type SubgraphProduct = {
  uuid: string;
  version: number;
  title: string;
  description: string;
  identification_sKU?: string;
  identification_productId?: string;
  identification_productIdType?: string;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string;
  productionInformation_manufacturerPartNumber?: string;
  productionInformation_modelNumber?: string;
  productionInformation_materials?: string[];
  visuals_images: {
    url: string;
    tag?: string;
  }[];
  visuals_videos?: {
    url: string;
    tag?: string;
  }[];
  packaging_packageQuantity?: string;
  packaging_dimensions_length?: string;
  packaging_dimensions_width?: string;
  packaging_dimensions_height?: string;
  packaging_dimensions_unit?: string;
  packaging_weight_value?: string;
  packaging_weight_unit?: string;
  details_category?: string;
  details_subCategory?: string;
  details_subCategory2?: string;
  details_offerCategory: string;
  details_tags?: string[];
  details_sections?: string[];
  details_personalisation?: string[];
};

function checkProductMetadata(
  productMetadata: subgraph.BaseProductV1ProductFieldsFragment,
  productFromSubgraph: SubgraphProduct
) {
  expect(productFromSubgraph.uuid).toEqual(productMetadata.uuid);
  expect(productFromSubgraph.version).toEqual(productMetadata.version);
  expect(productFromSubgraph.title).toEqual(productMetadata.title);
  expect(productFromSubgraph.description).toEqual(productMetadata.description);
  expect(productFromSubgraph.productionInformation_brandName).toEqual(
    productMetadata.brand.name
  );
  expect(productFromSubgraph.details_offerCategory).toEqual(
    productMetadata.offerCategory
  );
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

async function prepareMultiVariantOffers(
  coreSDK: CoreSDK,
  offersParams?: Array<Partial<CreateOfferArgs>>
) {
  const productUuid = productV1.buildUuid();
  const productMetadata = mockProductV1Metadata("a template", productUuid);

  const variations1 = [
    {
      type: "color",
      option: "red"
    },
    {
      type: "size",
      option: "XS"
    }
  ];
  const variations2 = [
    {
      type: "color",
      option: "blue"
    },
    {
      type: "size",
      option: "S"
    }
  ];
  const [metadata1, metadata2] = productV1.createVariantProductMetadata(
    productMetadata,
    [{ productVariant: variations1 }, { productVariant: variations2 }]
  );

  const [offer1Params, offer2Params] = offersParams || [];
  const p1 = createOfferArgs(coreSDK, metadata1, offer1Params);
  const p2 = createOfferArgs(coreSDK, metadata2, offer2Params);
  const [{ offerArgs: offerArgs1 }, { offerArgs: offerArgs2 }] =
    await Promise.all([p1, p2]);

  resolveDateValidity(offerArgs1);
  resolveDateValidity(offerArgs2);

  return {
    offerArgs: [offerArgs1, offerArgs2],
    productMetadata,
    productUuid,
    variations: [variations1, variations2]
  };
}

describe("additional tests", () => {
  test("overflowed returnPeriod", async () => {
    const { coreSDK, fundedWallet: sellerWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const template = "Hello World!!";
    const metadata = mockProductV1Metadata(template);
    metadata.shipping.returnPeriod = "1" + MAX_INT32.toString(); // Set a value greater than MAX_INT32
    const { offerArgs } = await createOfferArgs(coreSDK, metadata);
    resolveDateValidity(offerArgs);

    const offer = await createOffer(coreSDK, sellerWallet, offerArgs);
    expect(offer).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((offer?.metadata as any)?.shipping?.returnPeriodInDays).toEqual(
      MAX_INT32
    );
  });
  test("invalid returnPeriod", async () => {
    const template = "Hello World!!";
    const metadata = mockProductV1Metadata(template);
    expect(validateMetadata(metadata)).toBe(true);
    metadata.shipping.returnPeriod = "not a number";
    expect(() => validateMetadata(metadata)).toThrow();

    // Do not create the offer with this invalid returnPeriod because the subgraph does not support it
  });
});
