import {
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

test("handle OfferCreatedEvent with BASE metadata", () => {
  const offerCreatedEvent = createOfferCreatedEvent(
    1,
    1,
    1,
    1,
    1,
    1,
    1651574093,
    1651574093,
    1651574093,
    10000,
    10000,
    exchangeTokenAddress,
    "ipfs://" + metadataHash,
    metadataHash,
    false
  );
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

  clearStore();
});

test("handle OfferCreatedEvent with PRODUCT_V1 metadata", () => {
  const offerCreatedEvent = createOfferCreatedEvent(
    1,
    1,
    1,
    1,
    1,
    1,
    1651574093,
    1651574093,
    1651574093,
    10000,
    10000,
    exchangeTokenAddress,
    "ipfs://" + metadataHash,
    metadataHash,
    false
  );
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/product-v1.json");

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
    "ProductV1MetadataEntity",
    "1-metadata",
    "type",
    "PRODUCT_V1"
  );

  clearStore();
});

test("handle OfferVoidedEvent", () => {
  const offerCreatedEvent = createOfferCreatedEvent(
    1,
    1,
    1,
    1,
    1,
    1,
    1651574093,
    1651574093,
    1651574093,
    10000,
    10000,
    exchangeTokenAddress,
    "ipfs://" + metadataHash,
    metadataHash,
    false
  );
  mockExchangeTokenContractCalls(
    exchangeTokenAddress,
    exchangeTokenDecimals,
    exchangeTokenName,
    exchangeTokenSymbol
  );
  mockIpfsFile(metadataHash, "tests/metadata/base.json");
  handleOfferCreatedEvent(offerCreatedEvent);

  const offerVoidedEvent = createOfferVoidedEvent(1, 1);
  handleOfferVoidedEvent(offerVoidedEvent);

  assert.fieldEquals("Offer", "1", "voided", "true");
  assert.fieldEquals("BaseMetadataEntity", "1-metadata", "voided", "true");
});
