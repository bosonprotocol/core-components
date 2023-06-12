import { BigInt } from "@graphprotocol/graph-ts";
import {
  beforeEach,
  test,
  assert,
  clearStore,
  mockIpfsFile
} from "matchstick-as/assembly/index";
import {
  handleSellerCreatedEvent,
  handleSellerUpdatedEvent,
  handleBuyerCreatedEvent,
  handleSellerCreatedEventWithoutMetadataUri,
  handleSellerUpdateAppliedEvent
} from "../src/mappings/account-handler";
import {
  createSellerCreatedEvent,
  createSellerUpdatedEvent,
  createBuyerCreatedEvent,
  mockBosonVoucherContractCalls,
  createSellerCreatedEventLegacy,
  createSellerUpdateAppliedEvent,
  mockCreateProduct
} from "./mocks";
import { getSellerMetadataEntityId } from "../src/entities/metadata/seller";
import {
  getSalesChannelDeploymentId,
  getSalesChannelId
} from "../src/entities/metadata/seller/salesChannels";
import {
  Offer,
  ProductV1Product,
  SalesChannel,
  SalesChannelDeployment,
  SellerMetadata
} from "../generated/schema";
import { getMetadataEntityId } from "../src/entities/metadata/utils";
import { saveMetadata } from "../src/entities/metadata/handler";
import { getProductId } from "../src/entities/metadata/product-v1/product";

const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const voucherCloneAddress = "0x123456789a123456789a123456789a123456789a";
const sellerMetadataHash = "QmZffs1Uv6pmf4649UpMqinDord9QBerJaWcwRgdenAto1";
let hashCount = 0;

beforeEach(() => {
  clearStore();
});

test("handle legacy SellerCreatedEvent", () => {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 0);
  const sellerCreatedEvent = createSellerCreatedEventLegacy(
    1,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    voucherCloneAddress,
    0,
    0,
    sellerAddress
  );

  handleSellerCreatedEventWithoutMetadataUri(sellerCreatedEvent);

  assert.fieldEquals("Seller", "1", "id", "1");
  assert.fieldEquals("Seller", "1", "assistant", sellerAddress.toLowerCase());
  assert.fieldEquals("Seller", "1", "active", "true");
  assert.fieldEquals("Seller", "1", "authTokenId", "0");
  assert.fieldEquals("Seller", "1", "authTokenType", "0");
  assert.fieldEquals(
    "Seller",
    "1",
    "voucherCloneAddress",
    voucherCloneAddress.toLowerCase()
  );
});

function createSeller(
  sellerId: i32,
  sellerAddress: string,
  sellerMetadataFilepath: string
): string {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 0);
  mockIpfsFile(sellerMetadataHash, sellerMetadataFilepath);
  const sellerCreatedEvent = createSellerCreatedEvent(
    sellerId,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    voucherCloneAddress,
    0,
    0,
    sellerAddress,
    "ipfs://" + sellerMetadataHash
  );

  handleSellerCreatedEvent(sellerCreatedEvent);
  return sellerId.toString();
}

function updateSellerMetadata(
  sellerId: i32,
  sellerMetadataFilepath: string
): void {
  const uniqueHash = "123456789" + (123456789 * hashCount++).toString();
  mockIpfsFile(uniqueHash, sellerMetadataFilepath);
  const sellerUpdatedEvent = createSellerUpdateAppliedEvent(
    sellerId,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    true,
    0,
    0,
    sellerAddress,
    "ipfs://" + uniqueHash
  );

  handleSellerUpdateAppliedEvent(sellerUpdatedEvent);
}

test("handle SellerCreatedEvent", () => {
  const sellerId = createSeller(1, sellerAddress, "tests/metadata/seller.json");

  assert.fieldEquals("Seller", sellerId, "id", sellerId);
  assert.fieldEquals(
    "Seller",
    sellerId,
    "assistant",
    sellerAddress.toLowerCase()
  );
  assert.fieldEquals("Seller", sellerId, "active", "true");
  assert.fieldEquals("Seller", sellerId, "authTokenId", "0");
  assert.fieldEquals("Seller", sellerId, "authTokenType", "0");
  assert.fieldEquals(
    "Seller",
    "1",
    "voucherCloneAddress",
    voucherCloneAddress.toLowerCase()
  );
  assert.fieldEquals(
    "Seller",
    "1",
    "metadataUri",
    "ipfs://" + sellerMetadataHash
  );
  checkSalesChannelsLength(sellerId, 3);
  const dclSalesChannelId = getSalesChannelId(sellerId, "DCL");
  assert.fieldEquals("SalesChannel", dclSalesChannelId, "tag", "DCL");
  assert.fieldEquals(
    "SalesChannel",
    dclSalesChannelId,
    "settingsUri",
    "file://dclsettings"
  );
  const customSFSalesChannelId = getSalesChannelId(
    sellerId,
    "CustomStoreFront"
  );
  assert.fieldEquals(
    "SalesChannel",
    customSFSalesChannelId,
    "tag",
    "CustomStoreFront"
  );
  const customSFDeployment1Id = getSalesChannelDeploymentId(
    customSFSalesChannelId,
    "https://custom1"
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    customSFDeployment1Id,
    "link",
    "https://custom1"
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    customSFDeployment1Id,
    "lastUpdated",
    "1686133617000"
  );
  const customSFDeployment2Id = getSalesChannelDeploymentId(
    customSFSalesChannelId,
    "https://custom2"
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    customSFDeployment2Id,
    "link",
    "https://custom2"
  );
});

test("handle SellerUpdatedEvent", () => {
  const sellerUpdatedEvent = createSellerUpdatedEvent(
    1,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    false,
    123456789,
    1,
    sellerAddress
  );

  handleSellerUpdatedEvent(sellerUpdatedEvent);

  assert.fieldEquals("Seller", "1", "active", "false");
  assert.fieldEquals("Seller", "1", "authTokenId", "123456789");
  assert.fieldEquals("Seller", "1", "authTokenType", "1");
});

test("handle BuyerCreatedEvent", () => {
  const buyerCreatedEvent = createBuyerCreatedEvent(
    1,
    sellerAddress,
    sellerAddress
  );

  handleBuyerCreatedEvent(buyerCreatedEvent);

  assert.fieldEquals("Buyer", "1", "wallet", sellerAddress.toLowerCase());
  assert.fieldEquals("Buyer", "1", "active", "true");
});

test("add/remove product salesChannels", () => {
  const sellerId = createSeller(1, sellerAddress, "tests/metadata/seller.json");

  // mock creation of ProductV1Product for Product_A and Product_B
  let productA = mockCreateProduct("Product_A", 1);
  let productB = mockCreateProduct("Product_B", 5);

  // Update the seller to create salesChannel deployments on product_A and _B
  updateSellerMetadata(1, "tests/metadata/seller-updated-1.json");
  checkSalesChannelsLength(sellerId, 2);

  const dclSalesChannelId = getSalesChannelId(sellerId, "DCL");
  const deploymmentProductAId = getSalesChannelDeploymentId(
    dclSalesChannelId,
    productA.id
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    deploymmentProductAId,
    "product",
    productA.id
  );
  const deploymmentProductBId = getSalesChannelDeploymentId(
    dclSalesChannelId,
    productB.id
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    deploymmentProductBId,
    "product",
    productB.id
  );
  assert.fieldEquals(
    "SalesChannelDeployment",
    deploymmentProductBId,
    "link",
    "https://play.decentraland.org/?position=-75%2C114"
  );

  // Reload productA and productB to get the updated data
  productA = ProductV1Product.load(productA.id) as ProductV1Product;
  productB = ProductV1Product.load(productB.id) as ProductV1Product;
  checkProductSalesChannelsLength(productA.id, 2);
  checkProductSalesChannelsLength(productB.id, 1);
  const salesChannelProductBId = (
    (productB as ProductV1Product).salesChannels as string[]
  )[0];
  assert.assertNotNull(salesChannelProductBId);
  const salesChannelProductB = SalesChannel.load(salesChannelProductBId);
  assert.assertNotNull(salesChannelProductB);
  assert.assertNotNull((salesChannelProductB as SalesChannel).tag);
  assert.assertTrue((salesChannelProductB as SalesChannel).tag == "DCL");

  // mirrored values from `tests/metadata/product-v1-full.json`
  const metadataUuid = "ecf2a6dc-555b-41b5-aca8-b7e29eebbb30";
  const productUuid = "77593bb2-f797-11ec-b939-0242ac120002";
  const productVersion = 1;

  const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  mockIpfsFile(metadataHash, "tests/metadata/product-v1-full.json");

  const offerId = 1;
  const offer = new Offer(offerId.toString());
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.metadataUri = metadataHash;
  offer.metadataHash = metadataHash;
  offer.save();

  const metadataId = getMetadataEntityId(offerId.toString());
  saveMetadata(offer, BigInt.fromI32(1651574093));
  const productId = getProductId(productUuid, productVersion.toString());

  const product = ProductV1Product.load(productId);
  assert.assertNotNull(product);
  assert.assertNull((product as ProductV1Product).salesChannels);

  // Update the seller again
  updateSellerMetadata(1, "tests/metadata/seller-updated-2.json");
  checkSalesChannelsLength(sellerId, 1);

  checkProductSalesChannelsLength(productId, 1);

  checkProductSalesChannelsLength(productA.id, 0);
  checkProductSalesChannelsLength(productB.id, 1);
});

function checkSalesChannelsLength(sellerId: string, expected: number): void {
  const sellerMetadataId = getSellerMetadataEntityId(sellerId);
  assert.fieldEquals("Seller", sellerId, "metadata", sellerMetadataId);
  const sellerMetadata = SellerMetadata.load(sellerMetadataId);
  assert.assertNotNull(sellerMetadata);
  assert.fieldEquals("SellerMetadata", sellerMetadataId, "type", "SELLER");
  assert.assertTrue(
    ((sellerMetadata as SellerMetadata).salesChannels as string[]).length ===
      expected
  );
}

function checkProductSalesChannelsLength(
  productId: string,
  expected: number
): void {
  const product = ProductV1Product.load(productId) as ProductV1Product;
  assert.assertNotNull(product);
  assert.assertNotNull((product as ProductV1Product).salesChannels);
  assert.assertTrue(
    ((product as ProductV1Product).salesChannels as string[]).length ===
      expected
  );
}
