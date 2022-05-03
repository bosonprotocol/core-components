import { test, assert, clearStore } from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { Offer } from "../generated/schema";
import { handleBuyerCommittedEvent } from "../src/mappings/exchange-handler";
import { createBuyerCommittedEvent } from "./mocks";

test("handle BuyerCommittedEvent", () => {
  const offerId = 1;
  const offer = new Offer(offerId.toString());
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.save();

  const buyerCommittedEvent = createBuyerCommittedEvent(offerId, 2, 3);

  handleBuyerCommittedEvent(buyerCommittedEvent);

  assert.fieldEquals("Offer", "1", "quantityAvailable", "0");
  assert.fieldEquals("Exchange", "3", "id", "3");
  assert.fieldEquals("Exchange", "3", "state", "COMMITTED");

  clearStore();
});
