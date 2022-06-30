import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts";
import {
  ProductV1MetadataEntity,
  ProductV1Brand,
  Offer
} from "../../../generated/schema";

import { convertToString, convertToStringArray } from "../../utils/json";

export function saveProductV1Metadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  timestamp: BigInt
): string {
  const offerId = offer.id.toString();
  const metadataId = offerId + "-metadata";
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("externalUrl"));
  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));

  const images = convertToStringArray(metadataObj.get("images"));
  const tags = convertToStringArray(metadataObj.get("tags"));
  const brandName = convertToString(metadataObj.get("brandName"));

  saveProductV1Brand(brandName);

  let productV1MetadataEntity = ProductV1MetadataEntity.load(metadataId);

  if (!productV1MetadataEntity) {
    productV1MetadataEntity = new ProductV1MetadataEntity(metadataId);
  }

  productV1MetadataEntity.type = "PRODUCT_V1";
  productV1MetadataEntity.offer = offerId;
  productV1MetadataEntity.seller = offer.sellerId.toHexString();
  productV1MetadataEntity.exchangeToken = offer.exchangeToken;
  productV1MetadataEntity.createdAt = timestamp;
  productV1MetadataEntity.voided = offer.voided;
  productV1MetadataEntity.validFromDate = offer.validFromDate;
  productV1MetadataEntity.validUntilDate = offer.validUntilDate;
  productV1MetadataEntity.quantityAvailable = offer.quantityAvailable;
  productV1MetadataEntity.name = name;
  productV1MetadataEntity.description = description;
  productV1MetadataEntity.externalUrl = externalUrl;
  productV1MetadataEntity.schemaUrl = schemaUrl;
  productV1MetadataEntity.images = images;
  productV1MetadataEntity.tags = tags;
  productV1MetadataEntity.brandName = brandName;
  productV1MetadataEntity.brand = brandName.toLowerCase();
  productV1MetadataEntity.save();
  return metadataId;
}

function saveProductV1Brand(brandName: string): void {
  const brandId = brandName.toLowerCase();
  let brand = ProductV1Brand.load(brandId);

  if (!brand) {
    brand = new ProductV1Brand(brandId);
    brand.name = brandName;
    brand.save();
  }
}
