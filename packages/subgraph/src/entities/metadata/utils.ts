import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";

import { MetadataAttribute, Term } from "../../../generated/schema";
import { convertToString } from "../../utils/json";

export function getMetadataEntityId(id: string): string {
  return `${id}-metadata`;
}

export function getItemMetadataEntityId(id: string, index: string): string {
  return `${id}-item-${index}-metadata`;
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
    let traitType = convertToString(attributeObj.get("traitType"));
    if (!traitType) {
      traitType = convertToString(attributeObj.get("trait_type"));
    }
    const value = convertToString(attributeObj.get("value"));
    let displayType = convertToString(attributeObj.get("displayType"));
    if (!displayType) {
      displayType = convertToString(attributeObj.get("display_type"));
    }
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

export function getTermId(
  key: string,
  value: string,
  displayKey: string
): string {
  return `${key}-${value}-${displayKey}`;
}

export function saveTerms(
  termsArray: Array<TypedMap<string, JSONValue>>
): Array<string> {
  const savedTermsIds: string[] = [];

  for (let i = 0; i < termsArray.length; i++) {
    const termsObj = termsArray[i];
    const key = convertToString(termsObj.get("key"));
    const value = convertToString(termsObj.get("value"));
    const displayKey = convertToString(termsObj.get("displayKey"));
    const termId = getTermId(key, value, displayKey);

    let term = Term.load(termId);

    if (!term) {
      term = new Term(termId);
    }

    term.key = key;
    term.value = value;
    term.displayKey = displayKey;
    term.save();
    savedTermsIds.push(termId);
  }

  return savedTermsIds;
}
