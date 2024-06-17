import { AnyMetadata } from "@bosonprotocol/metadata-storage";

export type ERC721Metadata = AnyMetadata & {
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  external_link?: string;
  attributes?: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
};

/**
 * The ERC721 metadata standard defines the property `external_url` in snake_case.
 * We prefer to use camelCase though. To comply with the standard but still be consistent
 * in our code, we redundantly add the property `external_url` with the value of `externalUrl`.
 * Same with animationUrl field, and attributes items
 */
export function convertToERC721Metadata(metadata: AnyMetadata): ERC721Metadata {
  return {
    ...metadata,
    image_data: metadata["image_data"] || metadata["imageData"],
    external_url: metadata["external_url"] || metadata["externalUrl"],
    animation_url: metadata["animation_url"] || metadata["animationUrl"],
    youtube_url: metadata["youtube_url"] || metadata["youtubeUrl"],
    external_link: metadata["external_link"] || metadata["externalLink"],
    attributes: metadata["attributes"]?.map((attr) => {
      return {
        ...attr,
        trait_type: attr["trait_type"] || attr["traitType"],
        display_type: attr["display_type"] || attr["displayType"]
      };
    })
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
