import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { IBosonOfferHandler__getOfferResultOfferStruct } from "../../../generated/OfferHandler/IBosonOfferHandler";
import { BaseMetadataEntity } from "../../../generated/schema";

import { convertToString } from "../../utils/json";

export function saveBaseMetadata(
  offerFromContract: IBosonOfferHandler__getOfferResultOfferStruct,
  metadataObj: TypedMap<string, JSONValue>
): string {
  const offerId = offerFromContract.id.toString();
  const metadataId = offerId + "-metadata";
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("external_url"));
  const schemaUrl = convertToString(metadataObj.get("schema_url"));

  let baseMetadataEntity = BaseMetadataEntity.load(metadataId);

  if (baseMetadataEntity == null) {
    baseMetadataEntity = new BaseMetadataEntity(metadataId);
  }

  baseMetadataEntity.offer = offerId;
  baseMetadataEntity.seller = offerFromContract.seller.toHexString();
  baseMetadataEntity.exchangeToken =
    offerFromContract.exchangeToken.toHexString();
  baseMetadataEntity.voided = offerFromContract.voided;
  baseMetadataEntity.validFromDate = offerFromContract.validFromDate;
  baseMetadataEntity.validUntilDate = offerFromContract.validUntilDate;
  baseMetadataEntity.type = "BASE";
  baseMetadataEntity.name = name;
  baseMetadataEntity.description = description;
  baseMetadataEntity.externalUrl = externalUrl;
  baseMetadataEntity.schemaUrl = schemaUrl;
  baseMetadataEntity.save();
  return metadataId;
}
