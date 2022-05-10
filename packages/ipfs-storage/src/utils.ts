import { AnyMetadata } from "@bosonprotocol/metadata";

export type ERC721Metadata = Omit<AnyMetadata, "externalUrl" | "schemaUrl"> & {
  external_url: string;
  schema_url: string;
};

export function convertToERC721Metadata(metadata: AnyMetadata): ERC721Metadata {
  const { externalUrl, schemaUrl, ...rest } = metadata;

  return {
    ...rest,
    external_url: externalUrl,
    schema_url: schemaUrl
  };
}

export function convertFromERC721Metadata(
  erc721Metadata: ERC721Metadata
): AnyMetadata {
  const { external_url, schema_url, ...rest } = erc721Metadata;

  return {
    ...rest,
    externalUrl: external_url,
    schemaUrl: schema_url
  } as AnyMetadata;
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
