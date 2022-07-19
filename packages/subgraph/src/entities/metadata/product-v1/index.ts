import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts";

import { ProductV1MetadataEntity, Offer } from "../../../../generated/schema";
import {
  convertToObject,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import { getMetadataEntityId, saveMetadataAttributes } from "../utils";
import { saveProductV1ProductOrOverrides } from "./product";
import { saveProductV1Seller } from "./seller";
import { saveProductV1Variations } from "./variation";
import { saveProductV1Shipping } from "./shipping";
import { saveProductV1ExchangePolicy } from "./exchange-policy";

export function saveProductV1Metadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  timestamp: BigInt
): string {
  const offerId = offer.id.toString();
  const metadataId = getMetadataEntityId(offerId);

  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("externalUrl"));
  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));
  const image = convertToString(metadataObj.get("image"));
  const attributes = convertToObjectArray(metadataObj.get("attributes"));
  const uuid = convertToString(metadataObj.get("uuid"));

  const savedMetadataAttributeIds = saveMetadataAttributes(attributes);
  const savedProductId = saveProductV1ProductOrOverrides(
    convertToObject(metadataObj.get("product")),
    false
  );
  const savedVariationIds = saveProductV1Variations(
    convertToObjectArray(metadataObj.get("variations"))
  );
  const savedProductV1SellerId = saveProductV1Seller(
    convertToObject(metadataObj.get("seller")),
    offer.sellerId.toString()
  );
  const savedShippingId = saveProductV1Shipping(
    convertToObject(metadataObj.get("shipping")),
    metadataId
  );
  const savedExchangePolicyId = saveProductV1ExchangePolicy(
    convertToObject(metadataObj.get("exchangePolicy")),
    metadataId
  );
  const savedProductOverridesId = saveProductV1ProductOrOverrides(
    convertToObject(metadataObj.get("productOverrides")),
    true
  );

  if (
    savedProductId === null ||
    savedProductV1SellerId === null ||
    savedShippingId === null ||
    savedExchangePolicyId === null
  ) {
    return metadataId;
  }

  let productV1MetadataEntity = ProductV1MetadataEntity.load(metadataId);

  if (!productV1MetadataEntity) {
    productV1MetadataEntity = new ProductV1MetadataEntity(metadataId);
  }

  productV1MetadataEntity.name = name;
  productV1MetadataEntity.description = description;
  productV1MetadataEntity.externalUrl = externalUrl;
  productV1MetadataEntity.schemaUrl = schemaUrl;
  productV1MetadataEntity.type = "PRODUCT_V1";
  productV1MetadataEntity.image = image;
  productV1MetadataEntity.attributes = savedMetadataAttributeIds;
  productV1MetadataEntity.uuid = uuid;

  productV1MetadataEntity.offer = offerId;
  productV1MetadataEntity.seller = offer.sellerId.toString();
  productV1MetadataEntity.exchangeToken = offer.exchangeToken;

  productV1MetadataEntity.createdAt = timestamp;
  productV1MetadataEntity.voided = offer.voided;
  productV1MetadataEntity.validFromDate = offer.validFromDate;
  productV1MetadataEntity.validUntilDate = offer.validUntilDate;
  productV1MetadataEntity.quantityAvailable = offer.quantityAvailable;

  productV1MetadataEntity.product = savedProductId;
  productV1MetadataEntity.variations = savedVariationIds;
  productV1MetadataEntity.productV1Seller = savedProductV1SellerId;
  productV1MetadataEntity.shipping = savedShippingId;
  productV1MetadataEntity.exchangePolicy = savedExchangePolicyId;
  productV1MetadataEntity.productOverrides = savedProductOverridesId;

  productV1MetadataEntity.save();
  return metadataId;
}
