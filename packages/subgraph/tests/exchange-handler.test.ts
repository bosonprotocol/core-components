import {
  beforeEach,
  test,
  assert,
  clearStore,
  mockIpfsFile
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { Offer, BaseMetadataEntity } from "../generated/schema";
import { handleBuyerCommittedEvent } from "../src/mappings/exchange-handler";
import { createBuyerCommittedEvent } from "./mocks";

beforeEach(() => {
  clearStore();
});

test("handle BuyerCommittedEvent", () => {
  const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  mockIpfsFile(metadataHash, "tests/metadata/base.json");

  const offerId = 1;
  const offer = new Offer(offerId.toString());
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.metadataUri = metadataHash;
  offer.metadataHash = metadataHash;
  offer.save();

  const metadata = new BaseMetadataEntity(offerId.toString() + "-metadata");
  metadata.quantityAvailable = offer.quantityAvailable;
  metadata.save();

  const buyerCommittedEvent = createBuyerCommittedEvent(offerId, 2, 3);

  handleBuyerCommittedEvent(buyerCommittedEvent);

  assert.fieldEquals("Offer", "1", "quantityAvailable", "0");
  assert.fieldEquals(
    "BaseMetadataEntity",
    "1-metadata",
    "quantityAvailable",
    "0"
  );
  assert.fieldEquals("Exchange", "3", "id", "3");
  assert.fieldEquals("Exchange", "3", "state", "COMMITTED");
});
