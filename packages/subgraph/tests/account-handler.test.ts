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
  handleSellerCreatedEventWithoutMetadataUri
} from "../src/mappings/account-handler";
import {
  createSellerCreatedEvent,
  createSellerUpdatedEvent,
  createBuyerCreatedEvent,
  mockBosonVoucherContractCalls,
  createSellerCreatedEventLegacy
} from "./mocks";
import { getSellerMetadataEntityId } from "../src/entities/metadata/seller";
import {
  getSaleChannelDeploymentId,
  getSaleChannelId
} from "../src/entities/metadata/seller/saleChannels";
import { SellerMetadata } from "../generated/schema";
import { convertToStringArray } from "../src/utils/json";

const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const voucherCloneAddress = "0x123456789a123456789a123456789a123456789a";
const sellerMetadataHash = "QmZffs1Uv6pmf4649UpMqinDord9QBerJaWcwRgdenAto1";

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

test("handle SellerCreatedEvent", () => {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 0);
  mockIpfsFile(sellerMetadataHash, "tests/metadata/seller.json");
  const sellerCreatedEvent = createSellerCreatedEvent(
    1,
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
  const sellerId = "1";

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
  const sellerMetadataId = getSellerMetadataEntityId(sellerId);
  assert.fieldEquals("Seller", sellerId, "metadata", sellerMetadataId);
  assert.fieldEquals("SellerMetadata", sellerMetadataId, "type", "SELLER");
  const dclSaleChannelId = getSaleChannelId(sellerId, "DCL");
  assert.fieldEquals("SaleChannel", dclSaleChannelId, "tag", "DCL");
  assert.fieldEquals(
    "SaleChannel",
    dclSaleChannelId,
    "settingsUri",
    "file://dclsettings"
  );
  const deploymmentProductAId = getSaleChannelDeploymentId(
    dclSaleChannelId,
    "Product_A"
  );
  assert.fieldEquals(
    "SaleChannelDeployment",
    deploymmentProductAId,
    "product",
    "Product_A"
  );
  const deploymmentProductBId = getSaleChannelDeploymentId(
    dclSaleChannelId,
    "Product_B"
  );
  assert.fieldEquals(
    "SaleChannelDeployment",
    deploymmentProductBId,
    "product",
    "Product_B"
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
