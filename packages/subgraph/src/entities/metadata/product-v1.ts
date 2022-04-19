import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { ProductV1MetadataEntity } from "../../../generated/schema";

import { convertToString, convertToStringArray } from "../../utils/json";

export function saveProductV1Metadata(
  offerId: string,
  seller: string,
  metadataObj: TypedMap<string, JSONValue>
): string {
  const metadataId = offerId + "-metadata";
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("external_url"));
  const schemaUrl = convertToString(metadataObj.get("schema_url"));

  const images = convertToStringArray(metadataObj.get("images"));
  const tags = convertToStringArray(metadataObj.get("tags"));
  const brandName = convertToString(metadataObj.get("brandName"));

  const productV1MetadataEntity = new ProductV1MetadataEntity(metadataId);
  productV1MetadataEntity.type = "PRODUCT_V1";
  productV1MetadataEntity.offer = offerId;
  productV1MetadataEntity.seller = seller;
  productV1MetadataEntity.name = name;
  productV1MetadataEntity.description = description;
  productV1MetadataEntity.externalUrl = externalUrl;
  productV1MetadataEntity.schemaUrl = schemaUrl;
  productV1MetadataEntity.images = images;
  productV1MetadataEntity.tags = tags;
  productV1MetadataEntity.brandName = brandName;
  productV1MetadataEntity.save();
  return metadataId;
}
