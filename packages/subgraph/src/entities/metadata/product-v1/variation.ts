import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { ProductV1Variation } from "../../../../generated/schema";

import { convertToString } from "../../../utils/json";

export function getVariationId(
  variationType: string,
  variationOption: string
): string {
  return `${variationType.toLowerCase()}-${variationOption.toLowerCase()}`;
}

export function saveProductV1Variations(
  variations: Array<TypedMap<string, JSONValue>> | null
): string[] | null {
  if (variations === null) {
    return null;
  }

  const savedVariations: string[] = [];

  for (let i = 0; i < variations.length; i++) {
    const variationObject = variations[i];
    const variationType = convertToString(variationObject.get("type"));
    const variationOption = convertToString(variationObject.get("option"));
    const variationId = getVariationId(variationType, variationOption);

    let variation = ProductV1Variation.load(variationId);

    if (!variation) {
      variation = new ProductV1Variation(variationId);
    }

    variation.type = variationType;
    variation.option = variationOption;
    variation.save();

    savedVariations.push(variationId);
  }

  return savedVariations;
}
