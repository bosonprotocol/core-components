import { AnyMetadata } from "@bosonprotocol/metadata";
import { MetadataType } from "@bosonprotocol/metadata/dist/cjs/iMetadata";

export type ERC721Metadata = AnyMetadata & {
  external_url: string;
  animation_url: string;
};

/**
 * The ERC721 metadata standard defines the property `external_url` in snake_case.
 * We prefer to use camelCase though. To comply with the standard but still be consistent
 * in our code, we redundantly add the property `external_url` with the value of `externalUrl`.
 */
export function convertToERC721Metadata(metadata: AnyMetadata): ERC721Metadata {
  return {
    ...metadata,
    external_url: metadata["externalUrl"],
    animation_url: metadata["animationUrl"]
  };
}

export function sortObjKeys(
  objToSort: Record<string, unknown>
): Record<string, unknown> {
  return Object.keys(objToSort)
    .sort()
    .reduce<Record<string, unknown>>((obj, key) => {
      obj[key] = objToSort[key];
      return obj;
    }, {});
}
