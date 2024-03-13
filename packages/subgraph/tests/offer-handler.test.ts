import {
  beforeEach,
  test,
  assert,
  mockIpfsFile,
  clearStore
} from "matchstick-as/assembly/index";
import {
  getRangeId,
  handleOfferCreatedEvent,
  handleOfferCreatedEventLegacy,
  handleOfferExtendedEvent,
  handleOfferVoidedEvent,
  handleRangeReservedEvent
} from "../src/mappings/offer-handler";
import {
  createOfferCreatedEvent,
  createOfferCreatedEventLegacy,
  createOfferExtendedEvent,
  createOfferVoidedEvent,
  createRangeReservedEvent,
  createSeller,
  mockExchangeTokenContractCalls
} from "./mocks";

const exchangeTokenAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const exchangeTokenDecimals = 18;
const exchangeTokenName = "Exchange Token";
const exchangeTokenSymbol = "EXT";

const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";

const offerId = 1;
const sellerId = 1;
const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const voucherCloneAddress = "0x123456789a123456789a123456789a123456789a";
const sellerMetadataHash = "QmZffs1Uv6pmf4649UpMqinDord9QBerJaWcwRgdenAto1";
const price = 1;
const sellerDeposit = 1;
const protocolFee = 1;
const agentFee = 1;
const buyerCancelPenalty = 1;
const quantityAvailable = 1;
const validFromDate = 1651574093;
const validUntilDate = 1651574093;
const voucherRedeemableFromDate = 1651574093;
const voucherRedeemableUntilDate = 1651574093;
const disputePeriodDuration = 10;
const voucherValidDuration = 10;
const resolutionPeriodDuration = 10;
const disputeResolverId = 1;
const disputeEscalationResponsePeriod = 1;
const disputeFeeAmount = 1;
const disputeBuyerEscalationDeposit = 1;
const collectionIndex = 0;
const agentId = 1;
const executedBy = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

const offerCreatedEvent = createOfferCreatedEvent(
  offerId,
  sellerId,
  price,
  sellerDeposit,
  protocolFee,
  agentFee,
  buyerCancelPenalty,
  quantityAvailable,
  validFromDate,
  validUntilDate,
  voucherRedeemableFromDate,
  voucherRedeemableUntilDate,
  disputePeriodDuration,
  voucherValidDuration,
  resolutionPeriodDuration,
  exchangeTokenAddress,
  disputeResolverId,
  disputeEscalationResponsePeriod,
  disputeFeeAmount,
  disputeBuyerEscalationDeposit,
  "ipfs://" + metadataHash,
  metadataHash,
  false,
  collectionIndex,
  agentId,
  executedBy
);

const offerCreatedEventLegacy = createOfferCreatedEventLegacy(
  offerId,
  sellerId,
  price,
  sellerDeposit,
  protocolFee,
  agentFee,
  buyerCancelPenalty,
  quantityAvailable,
  validFromDate,
  validUntilDate,
  voucherRedeemableFromDate,
  voucherRedeemableUntilDate,
  disputePeriodDuration,
  voucherValidDuration,
  resolutionPeriodDuration,
  exchangeTokenAddress,
  disputeResolverId,
  disputeEscalationResponsePeriod,
  disputeFeeAmount,
  disputeBuyerEscalationDeposit,
  "ipfs://" + metadataHash,
  metadataHash,
  false,
  agentId,
  executedBy
);

beforeEach(() => {
  clearStore();
});

test("handle OfferCreatedEvent with BASE metadata", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );

  handleOfferCreatedEvent(offerCreatedEvent);

  assert.fieldEquals("Offer", "1", "id", "1");
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "id",
    exchangeTokenAddress.toLowerCase()
  );
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "name",
    exchangeTokenName
  );
  assert.fieldEquals("BaseMetadataEntity", "1-metadata", "type", "BASE");
  assert.fieldEquals(
    "DisputeResolutionTermsEntity",
    "1-1-terms",
    "disputeResolverId",
    "1"
  );
});

test("handle OfferCreatedEvent with PRODUCT_V1 metadata", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/product-v1-full.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );

  handleOfferCreatedEvent(offerCreatedEvent);

  assert.fieldEquals("Offer", "1", "id", "1");
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "id",
    exchangeTokenAddress.toLowerCase()
  );
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "name",
    exchangeTokenName
  );
  assert.fieldEquals(
    "DisputeResolutionTermsEntity",
    "1-1-terms",
    "disputeResolverId",
    "1"
  );
  assert.fieldEquals(
    "ProductV1MetadataEntity",
    "1-metadata",
    "type",
    "PRODUCT_V1"
  );
});

test("handle OfferVoidedEvent", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );
  handleOfferCreatedEvent(offerCreatedEvent);

  const offerVoidedEvent = createOfferVoidedEvent(1, 1, exchangeTokenAddress);
  handleOfferVoidedEvent(offerVoidedEvent);

  assert.fieldEquals("Offer", "1", "voided", "true");
  assert.fieldEquals("BaseMetadataEntity", "1-metadata", "voided", "true");
});

test("handleOfferExtendedEvent", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );
  handleOfferCreatedEvent(offerCreatedEvent);
  assert.fieldEquals("Offer", "1", "validUntilDate", validUntilDate.toString());

  const offerExtendedEvent = createOfferExtendedEvent(offerId, sellerId, validUntilDate + 1000, executedBy);
  handleOfferExtendedEvent(offerExtendedEvent);
  assert.fieldEquals("Offer", "1", "validUntilDate", (validUntilDate + 1000).toString());
  
});

test("handleRangeReservedEvent", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );
  handleOfferCreatedEvent(offerCreatedEvent);
  assert.fieldEquals("Offer", "1", "validUntilDate", validUntilDate.toString());

  const start = 12;
  const end = 24;
  const rangeReservedEvent = createRangeReservedEvent(offerId, sellerId, start, end, sellerAddress, executedBy);
  handleRangeReservedEvent(rangeReservedEvent);
  const rangeId = getRangeId(offerId.toString());
  assert.fieldEquals("RangeEntity", rangeId, "start", start.toString());
  assert.fieldEquals("RangeEntity", rangeId, "end", end.toString());
  assert.fieldEquals("RangeEntity", rangeId, "owner", sellerAddress.toLowerCase());
  assert.fieldEquals("RangeEntity", rangeId, "minted", "0");
});

test("handleOfferCreatedEventLegacy", () => {
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  createSeller(
    1,
    sellerAddress,
    "tests/metadata/seller.json",
    voucherCloneAddress,
    sellerMetadataHash
  );
  handleOfferCreatedEventLegacy(offerCreatedEventLegacy);
  assert.fieldEquals("Offer", "1", "id", "1");
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "id",
    exchangeTokenAddress.toLowerCase()
  );
  assert.fieldEquals(
    "ExchangeToken",
    exchangeTokenAddress.toLowerCase(),
    "name",
    exchangeTokenName
  );
});
