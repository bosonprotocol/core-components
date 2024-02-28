import { Exchange, Offer } from "./../generated/schema";
import {
  beforeEach,
  test,
  assert,
  clearStore,
  mockIpfsFile
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { BaseMetadataEntity } from "../generated/schema";
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
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = "1";
  const offer = new Offer(offerId.toString());
  // note: mockOffer() does not work in this test, no idea why
  offer.sellerId = BigInt.fromString(sellerId);
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.numberOfCommits = BigInt.fromI32(0);
  offer.metadataUri = `ipfs://${metadataHash}`;
  offer.metadataHash = metadataHash;
  offer.save();

  assert.fieldEquals("Offer", offerId.toString(), "quantityAvailable", "1");
  assert.fieldEquals("Offer", offerId.toString(), "numberOfCommits", "0");

  const metadata = new BaseMetadataEntity(offerId.toString() + "-metadata");
  metadata.quantityAvailable = (offer as Offer).quantityAvailable;
  metadata.numberOfCommits = BigInt.fromI32(0);
  metadata.save();

  const buyerCommittedEvent = createBuyerCommittedEvent(
    offerId,
    buyerId,
    exchangeId
  );

  handleBuyerCommittedEvent(buyerCommittedEvent);

  assert.fieldEquals("Offer", offerId.toString(), "quantityAvailable", "0");
  assert.fieldEquals("Offer", offerId.toString(), "numberOfCommits", "1");
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
  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "id",
    exchangeId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
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

  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "id",
    exchangeId.toString()
  );
  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "validUntilDate",
    validUntil.toString()
  );
});
