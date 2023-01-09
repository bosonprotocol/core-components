import {
  beforeEach,
  test,
  assert,
  clearStore
} from "matchstick-as/assembly/index";
import {
  handleSellerCreatedEvent,
  handleSellerUpdatedEvent,
  handleBuyerCreatedEvent
} from "../src/mappings/account-handler";
import {
  createSellerCreatedEvent,
  createSellerUpdatedEvent,
  createBuyerCreatedEvent,
  mockBosonVoucherContractCalls
} from "./mocks";

const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const voucherCloneAddress = "0x123456789a123456789a123456789a123456789a";

beforeEach(() => {
  clearStore();
});

test("handle SellerCreatedEvent", () => {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 0);
  const sellerCreatedEvent = createSellerCreatedEvent(
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

  handleSellerCreatedEvent(sellerCreatedEvent);

  assert.fieldEquals("Seller", "1", "id", "1");
  assert.fieldEquals("Seller", "1", "operator", sellerAddress.toLowerCase());
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
