import {
  beforeEach,
  test,
  assert,
  mockIpfsFile,
  clearStore
} from "matchstick-as/assembly/index";
import {
  handleOfferCreatedEvent,
  handleOfferVoidedEvent
} from "../src/mappings/offer-handler";
import {
  createOfferCreatedEvent,
  createOfferVoidedEvent,
  mockExchangeTokenContractCalls
} from "./mocks";

const exchangeTokenAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const exchangeTokenDecimals = 18;
const exchangeTokenName = "Exchange Token";
const exchangeTokenSymbol = "EXT";

const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";

const offerId = 1;
const sellerId = 1;
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
  handleOfferCreatedEvent(offerCreatedEvent);

  const offerVoidedEvent = createOfferVoidedEvent(1, 1, exchangeTokenAddress);
  handleOfferVoidedEvent(offerVoidedEvent);

  assert.fieldEquals("Offer", "1", "voided", "true");
  assert.fieldEquals("BaseMetadataEntity", "1-metadata", "voided", "true");
});
