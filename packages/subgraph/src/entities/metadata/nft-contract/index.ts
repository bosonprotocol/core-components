import { JSONValue, TypedMap, BigInt, log } from "@graphprotocol/graph-ts";
import { convertToString, convertToStringArray } from "../../../utils/json";
import { NftContractMetadata } from "../../../../generated/schema";

// source: https://docs.opensea.io/docs/contract-level-metadata

export function saveInnerNftContractMetadata(
  metadataId: string,
  metadataObj: TypedMap<string, JSONValue>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): void {
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const image = convertToString(metadataObj.get("image"));
  const externalLink = convertToString(metadataObj.get("external_link"));
  const collaborators = convertToStringArray(metadataObj.get("collaborators"));

  let nftContractMetadata = NftContractMetadata.load(metadataId);

  if (!nftContractMetadata) {
    nftContractMetadata = new NftContractMetadata(metadataId);
  }
  nftContractMetadata.createdAt = timestamp;
  nftContractMetadata.name = name;
  nftContractMetadata.description = description;
  nftContractMetadata.image = image;
  nftContractMetadata.externalLink = externalLink;
  nftContractMetadata.collaborators = collaborators;

  nftContractMetadata.save();
}
