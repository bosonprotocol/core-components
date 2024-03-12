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
  handleConditionalCommitAuthorizedEvent,
  handleExchangeCompletedEvent,
  handleVoucherCanceledEvent,
  handleVoucherExpiredEvent,
  handleVoucherExtendedEvent,
  handleVoucherRedeemedEvent,
  handleVoucherRevokedEvent,
  handleVoucherTransferredEvent
} from "../src/mappings/exchange-handler";
import {
  createBuyerCommittedEvent,
  createConditionalCommitAuthorizedEvent,
  createExchangeCompletedEvent,
  createGroupCreatedEvent,
  createVoucherCanceledEvent,
  createVoucherExpiredEvent,
  createVoucherExtendedEvent,
  createVoucherRedeemedEvent,
  createVoucherRevokedEvent,
  createVoucherTransferredEvent,
  mockExchange,
  mockOffer
} from "./mocks";
import { getOfferCollectionId } from "../src/mappings/account-handler";
import { getDisputeResolutionTermsId } from "../src/entities/dispute-resolution";
import { handleGroupCreatedEvent } from "../src/mappings/group-handler";
import { getEventLogId } from "../src/entities/event-log";

const executedBy = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

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

test("handleVoucherRevokedEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
  const voucherRevokedEvent = createVoucherRevokedEvent(
    offerId,
    exchangeId,
    executedBy
  );
  handleVoucherRevokedEvent(voucherRevokedEvent);
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "REVOKED");
});

test("handleVoucherCanceledEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
  const voucherCanceledEvent = createVoucherCanceledEvent(
    offerId,
    exchangeId,
    executedBy
  );
  handleVoucherCanceledEvent(voucherCanceledEvent);
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "CANCELLED");
});

test("handleVoucherExpiredEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
  const voucherExpiredEvent = createVoucherExpiredEvent(
    offerId,
    exchangeId,
    executedBy
  );
  handleVoucherExpiredEvent(voucherExpiredEvent);
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "CANCELLED");
  assert.fieldEquals("Exchange", exchangeId.toString(), "expired", "true");
});

test("handleVoucherRedeemedEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
  const voucherRedeemedEvent = createVoucherRedeemedEvent(
    offerId,
    exchangeId,
    executedBy
  );
  handleVoucherRedeemedEvent(voucherRedeemedEvent);
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "REDEEMED");
});

test("handleExchangeCompletedEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMMITTED");
  const exchangeCompletedEvent = createExchangeCompletedEvent(
    offerId,
    buyerId,
    exchangeId,
    executedBy
  );
  handleExchangeCompletedEvent(exchangeCompletedEvent);
  assert.fieldEquals("Exchange", exchangeId.toString(), "state", "COMPLETED");
});

test("handleVoucherTransferredEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  const newBuyerId = 6;
  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "buyer",
    buyerId.toString()
  );
  const voucherTransferredEvent = createVoucherTransferredEvent(
    offerId,
    exchangeId,
    newBuyerId,
    executedBy
  );
  handleVoucherTransferredEvent(voucherTransferredEvent);
  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "buyer",
    newBuyerId.toString()
  );
});

test("handleConditionalCommitAuthorizedEvent", () => {
  const offerId = 1;
  const buyerId = 2;
  const exchangeId = 3;
  const sellerId = 4;
  const disputeResolverId = 5;
  const gating = i8(1);
  const buyerAddress = "0x0123456789987654321001234567899876543210";
  const tokenId = 123456789;
  const commitCount = 1;
  const maxCommits = 3;
  const groupId = 7;
  const method = i8(0);
  const tokenType = i8(1);
  const tokenAddress = "0x0123456789012345678901234567890123456789";
  const minTokenId = 123;
  const maxTokenId = 456;
  const threshold = 6;
  const executedBy = "0x0abcdef1234567890abcdef12345678901234567";

  mockOffer(offerId.toString(), sellerId.toString());
  const groupCreatedEvent = createGroupCreatedEvent(
    groupId,
    sellerId,
    [offerId],
    method,
    tokenType,
    tokenAddress,
    gating,
    minTokenId,
    threshold,
    maxCommits,
    maxTokenId,
    executedBy
  );
  handleGroupCreatedEvent(groupCreatedEvent);
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "id",
    groupId.toString()
  );
  assert.fieldEquals(
    "Offer",
    offerId.toString(),
    "condition",
    groupId.toString()
  );

  mockExchange(
    exchangeId.toString(),
    offerId.toString(),
    sellerId.toString(),
    buyerId.toString(),
    disputeResolverId.toString()
  );
  assert.fieldEquals(
    "Exchange",
    exchangeId.toString(),
    "buyer",
    buyerId.toString()
  );
  const conditionalCommitAuthorizedEvent =
    createConditionalCommitAuthorizedEvent(
      offerId,
      gating,
      buyerAddress,
      tokenId,
      commitCount,
      maxCommits
    );
  const txHash =
    conditionalCommitAuthorizedEvent.transaction.hash.toHexString();
  const logIndex = conditionalCommitAuthorizedEvent.logIndex;

  handleConditionalCommitAuthorizedEvent(conditionalCommitAuthorizedEvent);
  const eventLogId = getEventLogId(txHash, logIndex, offerId.toString());
  assert.fieldEquals(
    "ConditionalCommitAuthorizedEventLog",
    eventLogId,
    "hash",
    txHash
  );
});
