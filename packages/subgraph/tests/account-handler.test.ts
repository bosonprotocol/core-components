import { test, assert, clearStore } from "matchstick-as/assembly/index";
import {
  handleSellerCreatedEvent,
  handleSellerUpdatedEvent,
  handleBuyerCreatedEvent
} from "../src/mappings/account-handler";
import {
  createSellerCreatedEvent,
  createSellerUpdatedEvent,
  createBuyerCreatedEvent
} from "./mocks";

const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

test("handle SellerCreatedEvent", () => {
  const sellerCreatedEvent = createSellerCreatedEvent(
    1,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress
  );

  handleSellerCreatedEvent(sellerCreatedEvent);

  assert.fieldEquals("Seller", "1", "id", "1");
  assert.fieldEquals("Seller", "1", "operator", sellerAddress.toLowerCase());
  assert.fieldEquals("Seller", "1", "active", "true");

  clearStore();
});

test("handle SellerUpdatedEvent", () => {
  const sellerUpdatedEvent = createSellerUpdatedEvent(
    1,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    false,
    sellerAddress
  );

  handleSellerUpdatedEvent(sellerUpdatedEvent);

  assert.fieldEquals("Seller", "1", "active", "false");

  clearStore();
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

  clearStore();
});
