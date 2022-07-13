import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";

import { MetadataAttribute } from "../../../generated/schema";
import { convertToString } from "../../utils/json";

export function getMetadataEntityId(offerId: string): string {
  return `${offerId}-metadata`;
}

export function getMetadataAttributeId(
  traitType: string,
  value: string,
  displayType: string
): string {
  return `${traitType}-${value}-${displayType}`;
}

export function saveMetadataAttributes(
  attributesArray: Array<TypedMap<string, JSONValue>>
): Array<string> {
  const savedMetadataAttributeIds: string[] = [];

  for (let i = 0; i < attributesArray.length; i++) {
    const attributeObj = attributesArray[i];
    const traitType = convertToString(attributeObj.get("trait_type"));
    const value = convertToString(attributeObj.get("value"));
    const displayType = convertToString(attributeObj.get("display_type"));
    const attributeId = getMetadataAttributeId(traitType, value, displayType);

    let metadataAttribute = MetadataAttribute.load(attributeId);

    if (!metadataAttribute) {
      metadataAttribute = new MetadataAttribute(attributeId);
    }

    metadataAttribute.traitType = traitType;
    metadataAttribute.value = value;
    metadataAttribute.displayType = displayType;
    metadataAttribute.save();
    savedMetadataAttributeIds.push(attributeId);
  }

  return savedMetadataAttributeIds;
}
