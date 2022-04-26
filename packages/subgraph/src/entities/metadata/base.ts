import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { BaseMetadataEntity } from "../../../generated/schema";

import { convertToString } from "../../utils/json";

export function saveBaseMetadata(
  offerId: string,
  sellerId: string,
  metadataObj: TypedMap<string, JSONValue>
): string {
  const metadataId = offerId + "-metadata";
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("external_url"));
  const schemaUrl = convertToString(metadataObj.get("schema_url"));

  const baseMetadataEntity = new BaseMetadataEntity(metadataId);
  baseMetadataEntity.offer = offerId;
  baseMetadataEntity.seller = sellerId;
  baseMetadataEntity.type = "BASE";
  baseMetadataEntity.name = name;
  baseMetadataEntity.description = description;
  baseMetadataEntity.externalUrl = externalUrl;
  baseMetadataEntity.schemaUrl = schemaUrl;
  baseMetadataEntity.save();
  return metadataId;
}
