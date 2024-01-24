import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { getItemMetadataEntityId, saveMetadataAttributes } from "../utils";
import {
  convertToInt,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import { NftItemMetadataEntity, Offer } from "../../../../generated/schema";

export function saveNftItemMetadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  itemMetadataUri: string,
  index: string,
  bundleId: string
): string {
  const offerId = offer.id.toString();
  const metadataId = getItemMetadataEntityId(offerId, index);

  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));
  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const image = convertToString(metadataObj.get("image"));
  const externalUrl = convertToString(metadataObj.get("externalUrl"));
  const animationUrl = convertToString(metadataObj.get("animationUrl"));
  const chainId = convertToInt(metadataObj.get("chainId"));
  const contract = convertToString(metadataObj.get("contract"));
  const tokenId = convertToString(metadataObj.get("tokenId"));
  const quantity = convertToInt(metadataObj.get("quantity"));

  const attributes = convertToObjectArray(metadataObj.get("attributes"));
  const savedMetadataAttributeIds = saveMetadataAttributes(attributes);

  let nftItemMetadataEntity = NftItemMetadataEntity.load(metadataId);
  if (!nftItemMetadataEntity) {
    nftItemMetadataEntity = new NftItemMetadataEntity(metadataId);
  }

  nftItemMetadataEntity.type = "ITEM_NFT";
  nftItemMetadataEntity.schemaUrl = schemaUrl;
  nftItemMetadataEntity.name = name;
  nftItemMetadataEntity.description = description;
  nftItemMetadataEntity.image = image;
  nftItemMetadataEntity.externalUrl = externalUrl;
  nftItemMetadataEntity.animationUrl = animationUrl;
  nftItemMetadataEntity.chainId = chainId;
  nftItemMetadataEntity.contract = contract;
  nftItemMetadataEntity.tokenId = tokenId;
  nftItemMetadataEntity.quantity = quantity;
  nftItemMetadataEntity.attributes = savedMetadataAttributeIds;
  nftItemMetadataEntity.bundle = bundleId;
  nftItemMetadataEntity.metadataUri = itemMetadataUri;

  nftItemMetadataEntity.save();
  return metadataId;
}
