import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { AnimationMetadata } from "../../../generated/schema";

import { convertToInt, convertToString } from "../../utils/json";

export function getAnimationMetadataId(
  height: number,
  name: string,
  width: number
): string {
  return `${height}-${name.toLowerCase()}-${width}`;
}

export function saveAnimationMetadata(
  animationMetadata: TypedMap<string, JSONValue> | null
): string | null {
  if (!animationMetadata) {
    return null;
  }

  const height = convertToInt(animationMetadata.get("height"));
  const name = convertToString(animationMetadata.get("name"));
  const width = convertToInt(animationMetadata.get("width"));

  const animationMetadataId = getAnimationMetadataId(height, name, width);

  let animationMetadataEntity = AnimationMetadata.load(animationMetadataId);

  if (!animationMetadataEntity) {
    animationMetadataEntity = new AnimationMetadata(animationMetadataId);
    animationMetadataEntity.height = height;
    animationMetadataEntity.name = name;
    animationMetadataEntity.width = width;
    animationMetadataEntity.save();
  }

  return animationMetadataId;
}
