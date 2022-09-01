import {
  beforeEach,
  test,
  assert,
  clearStore,
  mockFunction
} from "matchstick-as/assembly/index";
import { handleDisputeRaisedEvent } from "../src/mappings/dispute-handler";
import { createDisputeRaisedEvent } from "./mocks";

const contractAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const exchangeId = 1;
const buyerId = 2;
const sellerId = 3;
const complaint = "complaint";
const executedBy = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

beforeEach(() => {
  clearStore();
});

test("handle DisputeRaised event", () => {
  const disputeRaisedEvent = createDisputeRaisedEvent(
    exchangeId,
    buyerId,
    sellerId,
    complaint,
    executedBy
  );

  handleSellerCreatedEvent(sellerCreatedEvent);

  assert.fieldEquals("Seller", "1", "id", "1");
  assert.fieldEquals("Seller", "1", "operator", sellerAddress.toLowerCase());
  assert.fieldEquals("Seller", "1", "active", "true");
});
