import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts";
import { BaseMetadataEntity, Offer } from "../../../generated/schema";

import { convertToString } from "../../utils/json";

export function saveBaseMetadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): string {
  const offerId = offer.id.toString();
  const metadataId = offerId + "-metadata";
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("externalUrl"));
  const animationUrl = convertToString(metadataObj.get("animationUrl"));
  const licenseUrl = convertToString(metadataObj.get("licenseUrl"));
  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));
  const condition = convertToString(metadataObj.get("condition"));

  let baseMetadataEntity = BaseMetadataEntity.load(metadataId);

  if (!baseMetadataEntity) {
    baseMetadataEntity = new BaseMetadataEntity(metadataId);
  }

  baseMetadataEntity.offer = offerId;
  baseMetadataEntity.seller = offer.sellerId.toString();
  baseMetadataEntity.exchangeToken = offer.exchangeToken.toString();
  baseMetadataEntity.voided = offer.voided;
  baseMetadataEntity.createdAt = timestamp;
  baseMetadataEntity.validFromDate = offer.validFromDate;
  baseMetadataEntity.validUntilDate = offer.validUntilDate;
  baseMetadataEntity.quantityAvailable = offer.quantityAvailable;
  baseMetadataEntity.numberOfCommits = offer.numberOfCommits;
  baseMetadataEntity.numberOfRedemptions = offer.numberOfRedemptions;
  baseMetadataEntity.type = "BASE";
  baseMetadataEntity.name = name;
  baseMetadataEntity.description = description;
  baseMetadataEntity.externalUrl = externalUrl;
  baseMetadataEntity.animationUrl = animationUrl;
  baseMetadataEntity.licenseUrl = licenseUrl;
  baseMetadataEntity.schemaUrl = schemaUrl;
  baseMetadataEntity.condition = condition;
  baseMetadataEntity.save();
  return metadataId;
}
