import { Exchange } from "./../generated/schema";
import {
  beforeEach,
  test,
  assert,
  clearStore,
  mockIpfsFile
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { Offer, BaseMetadataEntity } from "../generated/schema";
import {
  handleBuyerCommittedEvent,
  handleVoucherExtendedEvent
} from "../src/mappings/exchange-handler";
import { createBuyerCommittedEvent, createVoucherExtendedEvent } from "./mocks";

beforeEach(() => {
  clearStore();
});

test("handle BuyerCommittedEvent", () => {
  const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  mockIpfsFile(metadataHash, "tests/metadata/base.json");

  const offerId = 1;
  const offer = new Offer(offerId.toString());
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.numberOfCommits = BigInt.fromI32(0);
  offer.metadataUri = metadataHash;
  offer.metadataHash = metadataHash;
  offer.save();

  const metadata = new BaseMetadataEntity(offerId.toString() + "-metadata");
  metadata.quantityAvailable = offer.quantityAvailable;
  metadata.numberOfCommits = BigInt.fromI32(0);
  metadata.save();

  const buyerCommittedEvent = createBuyerCommittedEvent(offerId, 2, 3);

  handleBuyerCommittedEvent(buyerCommittedEvent);

  assert.fieldEquals("Offer", "1", "quantityAvailable", "0");
  assert.fieldEquals("Offer", "1", "numberOfCommits", "1");
  assert.fieldEquals(
    "BaseMetadataEntity",
    "1-metadata",
    "quantityAvailable",
    "0"
  );
  assert.fieldEquals(
    "BaseMetadataEntity",
    "1-metadata",
    "numberOfCommits",
    "1"
  );
  assert.fieldEquals("Exchange", "3", "id", "3");
  assert.fieldEquals("Exchange", "3", "state", "COMMITTED");
});

test("handle VoucherExtendedEvent", () => {
  const offerId = 1;
  const exchangeId = 3;
  const exchange = new Exchange(exchangeId.toString());
  exchange.validUntilDate = BigInt.fromI32(1234567);
  exchange.save();

  const validUntil = 2345678;

  const voucherExtendedEvent = createVoucherExtendedEvent(
    offerId,
    exchangeId,
    validUntil,
    "0x123456789a123456789a123456789a123456789a"
  );

  handleVoucherExtendedEvent(voucherExtendedEvent);

  assert.fieldEquals("Exchange", "3", "id", exchangeId.toString());
  assert.fieldEquals("Exchange", "3", "validUntilDate", validUntil.toString());
});
