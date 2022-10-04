import { AdditionalOfferMetadata } from "./../../packages/core-sdk/src/offers/renderContractualAgreement";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { MetadataType } from "@bosonprotocol/metadata";
import { CreateOfferArgs } from "@bosonprotocol/common";
import {
  mockAdditionalOfferMetadata,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
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

function mockProductV1Metadata(template: string): ProductV1Metadata {
  return {
    ...productV1ValidMinimalOffer,
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
  const seller = await ensureCreatedSeller(sellerWallet);
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
    offerArgs.validFromDateInMS = BigNumber.from(offerArgs.validFromDateInMS)
      .add(10000) // to avoid offerDaa validation error
      .toNumber();
    offerArgs.voucherRedeemableFromDateInMS = BigNumber.from(
      offerArgs.voucherRedeemableFromDateInMS
    )
      .add(10000) // to avoid offerDaa validation error
      .toNumber();
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

// TODO: create batch offers with productV1 metadata (different variant of same product)
// TODO: get Product from product Id
// TODO: get Offers from Product
