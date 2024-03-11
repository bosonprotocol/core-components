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
import { getOfferCollectionId } from "../src/mappings/account-handler";
import { getDisputeResolutionTermsId } from "../src/entities/dispute-resolution";

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
  offer.createdAt = BigInt.fromI32(0);
  offer.price = BigInt.fromI32(100);
  offer.sellerDeposit = BigInt.fromI32(5);
  offer.protocolFee = BigInt.fromI32(1);
  offer.agentFee = BigInt.fromI32(0);
  offer.agentId = BigInt.fromI32(0);
  offer.buyerCancelPenalty = BigInt.fromI32(2);
  offer.quantityInitial = BigInt.fromI32(1);
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.validFromDate = BigInt.fromI32(0);
  offer.validUntilDate = BigInt.fromI32(0);
  offer.voucherRedeemableFromDate = BigInt.fromI32(0);
  offer.voucherRedeemableUntilDate = BigInt.fromI32(0);
  offer.disputePeriodDuration = BigInt.fromI32(0);
  offer.voucherValidDuration = BigInt.fromI32(0);
  offer.resolutionPeriodDuration = BigInt.fromI32(0);
  offer.metadataUri = `ipfs://${metadataHash}`;
  offer.metadataHash = metadataHash;
  offer.voided = false;
  offer.collectionIndex = BigInt.fromI32(0);
  offer.collection = getOfferCollectionId(sellerId, "0");
  offer.disputeResolverId = BigInt.fromI32(5);
  offer.disputeResolver = "5";
  offer.disputeResolutionTerms = getDisputeResolutionTermsId(
    "5",
    offerId.toString()
  );
  offer.sellerId = BigInt.fromString(sellerId);
  offer.seller = sellerId;
  offer.exchangeToken = "0xaaaaabbbbbcccccdddddeeeeefffff0000011111";
  offer.numberOfCommits = BigInt.fromI32(0);
  offer.numberOfRedemptions = BigInt.fromI32(0);
  offer.save();

  assert.fieldEquals("Offer", offerId.toString(), "quantityAvailable", "1");
  assert.fieldEquals("Offer", offerId.toString(), "numberOfCommits", "0");

  const metadata = new BaseMetadataEntity(offerId.toString() + "-metadata");
  metadata.name = "name";
  metadata.description = "description";
  metadata.externalUrl = "ipfs://metadataUri";
  metadata.licenseUrl = "ipfs://licenseUrl";
  metadata.schemaUrl = "ipfs://schemaUrl";
  metadata.type = "BASE";
  metadata.image = "ipfs://image";
  metadata.offer = offerId.toString();
  metadata.seller = sellerId;
  metadata.exchangeToken = "0xaaaaabbbbbcccccdddddeeeeefffff0000011111";
  metadata.createdAt = BigInt.fromI32(0);
  metadata.voided = false;
  metadata.validFromDate = BigInt.fromI32(0);
  metadata.validUntilDate = BigInt.fromI32(0);
  metadata.quantityAvailable = (offer as Offer).quantityAvailable;
  metadata.numberOfCommits = BigInt.fromI32(0);
  metadata.numberOfRedemptions = BigInt.fromI32(0);
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
  exchange.offer = offerId.toString();
  exchange.buyer = "1";
  exchange.seller = "2";
  exchange.disputeResolver = "3";
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = BigInt.fromI32(1);
  exchange.validUntilDate = BigInt.fromI32(1234567);
  exchange.expired = false;
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

// TODO: add test for handleVoucherRevokedEvent
// TODO: add test for handleVoucherCanceledEvent
// TODO: add test for handleVoucherExpiredEvent
// TODO: add test for handleVoucherRedeemedEvent
// TODO: add test for handleVoucherTransferredEvent
// TODO: add test for handleExchangeCompletedEvent
// TODO: add test for handleConditionalCommitAuthorizedEvent
