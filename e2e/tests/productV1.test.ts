import { ProductCardImageWrapper } from "./../../packages/react-kit/src/components/productCard/ProductCard.styles";
import { v4 as uuidv4 } from "uuid";
import { AdditionalOfferMetadata } from "./../../packages/core-sdk/src/offers/renderContractualAgreement";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { MetadataType, productV1 } from "@bosonprotocol/metadata";
import { CreateOfferArgs } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import { ProductV1Metadata } from "@bosonprotocol/metadata/dist/cjs/product-v1";
import { Wallet } from "ethers";
import { CoreSDK, subgraph } from "../../packages/core-sdk/src";
import {
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  seedWallet10,
  waitForGraphNodeIndexing
} from "./utils";
import productV1ValidMinimalOffer from "../../packages/metadata/tests/product-v1/valid/minimalOffer.json";
import { SEC_PER_DAY } from "@bosonprotocol/common/src/utils/timestamp";

jest.setTimeout(120_000);

const seedWallet = seedWallet10; // be sure the seedWallet is not used by another test (to allow concurrent run)

function mockProductV1Metadata(
  template: string,
  productUuid: string = uuidv4()
): ProductV1Metadata {
  return {
    ...productV1ValidMinimalOffer,
    product: {
      ...productV1ValidMinimalOffer.product,
      uuid: productUuid
    },
    uuid: uuidv4(),
    type: MetadataType.PRODUCT_V1,
    exchangePolicy: {
      ...productV1ValidMinimalOffer.exchangePolicy,
      template
    }
  };
}

async function createOfferArgs(
  coreSDK: CoreSDK,
  metadata: ProductV1Metadata,
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

    const productUuid = uuidv4();
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
      [variations1, variations2]
    );

    const p1 = createOfferArgs(coreSDK, metadata1);
    const p2 = createOfferArgs(coreSDK, metadata2);
    const [{ offerArgs: offerArgs1 }, { offerArgs: offerArgs2 }] =
      await Promise.all([p1, p2]);

    const offersFilter = {
      offersFilter: {
        sellerId: seller.id
      }
    };
    const productsFilter = {
      productsFilter: {
        productV1Seller_: {
          sellerId: seller.id
        }
      }
    };

    resolveDateValidity(offerArgs1);
    resolveDateValidity(offerArgs2);

    // Get the number of offers of this seller before
    const offersBefore = await coreSDK.getOffers(offersFilter);
    expect(offersBefore).toBeTruthy();

    // Get the number of products of this seller before
    const productsBefore = await coreSDK.getProductV1Products(productsFilter);
    expect(productsBefore).toBeTruthy();

    const offer1 = await createOffer(coreSDK, sellerWallet, offerArgs1);
    const offer2 = await createOffer(coreSDK, sellerWallet, offerArgs2);
    // const [ offer1, offer2] = await Promise.all([offer_p1, offer_p2]);
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

  test("another one", async () => {
    // Call coreSDK.getOffersByProduct(productUuid, version?) --> [offer1, offer2]
    // Check both offer matches the respective offerArgs and metadata
    // Call coreSDK.getProduct(productUuid, version?) --> productData
    // Call coreSDK.getProductVariations(productUuid, version?) --> [variant1 --> offer1, variant2 --> offer2]
    // OR, the same method coreSDK.getProduct(productUuid, version?) --> productData + [variant1 --> offer1, variant2 --> offer2]
    // Check productData matches the offerArgs and metadata, except the variations
    // coreSDK.getProductVariant(productUuid, version?, [variations]) --> offer
  });

  // TODO: create batch offers with productV1 metadata (different variant of same product)
  // TODO: get Product from product Id
  // TODO: get Offers from Product
});

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

