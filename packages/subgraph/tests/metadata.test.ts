import {
  beforeEach,
  test,
  assert,
  mockIpfsFile,
  clearStore
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { Offer } from "../generated/schema";

import { saveMetadata } from "../src/entities/metadata/handler";
import { getMetadataEntityId } from "../src/entities/metadata/utils";
import { getProductId } from "../src/entities/metadata/product-v1/product";

beforeEach(() => {
  clearStore();
});

test("save PRODUCT_V1 metadata product-v1-full.json", () => {
  // mirrored values from `tests/metadata/product-v1-full.json`
  const metadataUuid = "ecf2a6dc-555b-41b5-aca8-b7e29eebbb30";
  const productUuid = "77593bb2-f797-11ec-b939-0242ac120002";
  const productVersion = 1;

  const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  mockIpfsFile(metadataHash, "tests/metadata/product-v1-full.json");

  const offerId = 1;
  const offer = new Offer(offerId.toString());
  offer.quantityAvailable = BigInt.fromI32(1);
  offer.metadataUri = metadataHash;
  offer.metadataHash = metadataHash;
  offer.save();

  const metadataId = getMetadataEntityId(offerId.toString());
  saveMetadata(offer, BigInt.fromI32(1651574093));

  // metadata-level fields
  assert.fieldEquals(
    "ProductV1MetadataEntity",
    metadataId,
    "uuid",
    metadataUuid
  );
  assert.fieldEquals(
    "ProductV1MetadataEntity",
    metadataId,
    "animationUrl",
    "https://app.bosonportal.io/animation"
  );
  assert.entityCount("MetadataAttribute", 3);

  // product-level fields
  const productId = getProductId(productUuid, productVersion.toString());
  assert.entityCount("ProductV1Product", 1);
  assert.fieldEquals("ProductV1Product", productId, "uuid", productUuid);
  assert.fieldEquals(
    "ProductV1Product",
    productId,
    "offerCategory",
    "PHYSICAL"
  );
  assert.fieldEquals(
    "ProductV1Brand",
    "boson x metafactory",
    "name",
    "Boson X MetaFactory"
  );
  assert.entityCount("ProductV1Category", 3);
  assert.entityCount("ProductV1Tag", 3);
  assert.entityCount("ProductV1Section", 2);
  assert.entityCount("ProductV1Personalisation", 2);

  // variations
  assert.entityCount("ProductV1Variation", 2);

  // seller-level fields
  assert.entityCount("ProductV1Seller", 1);
  assert.entityCount("ProductV1SellerContactLink", 2);

  // shipping-level fields
  assert.entityCount("ProductV1ShippingOption", 1);
  assert.entityCount("ProductV1ShippingJurisdiction", 2);

  // exchange-policy-level fields
  assert.entityCount("ProductV1ExchangePolicy", 1);

  // overrides-level fields
  assert.entityCount("ProductV1ProductOverrides", 1);
});
