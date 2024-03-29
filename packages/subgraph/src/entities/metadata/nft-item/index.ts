import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import {
  getItemMetadataEntityId,
  saveMetadataAttributes,
  saveTerms
} from "../utils";
import {
  convertToInt,
  convertToObject,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import {
  NftItemMetadataEntity,
  Offer,
  TokenIdRange
} from "../../../../generated/schema";

function saveTokenIdRange(
  tokenIdRangeObj: TypedMap<string, JSONValue>
): string {
  const min = convertToString(tokenIdRangeObj.get("min"));
  const max = convertToString(tokenIdRangeObj.get("max"));
  const tokenIdRangeId = `range-${min}-${max}`;
  let tokenIdRange = TokenIdRange.load(tokenIdRangeId);
  if (!tokenIdRange) {
    tokenIdRange = new TokenIdRange(tokenIdRangeId);
    tokenIdRange.min = min;
    tokenIdRange.max = max;
    tokenIdRange.save();
  }
  return tokenIdRangeId;
}

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
  const youtubeUrl = convertToString(metadataObj.get("youtubeUrl"));
  const chainId = convertToInt(metadataObj.get("chainId"));
  const contract = convertToString(metadataObj.get("contract"));
  const tokenId = convertToString(metadataObj.get("tokenId"));
  const tokenIdRangeObj = convertToObject(metadataObj.get("tokenIdRange"));
  const quantity = convertToInt(metadataObj.get("quantity"));

  const attributes = convertToObjectArray(metadataObj.get("attributes"));
  const savedMetadataAttributeIds = saveMetadataAttributes(attributes);

  const terms = convertToObjectArray(metadataObj.get("terms"));
  const savedTermsIds = saveTerms(terms);

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
  nftItemMetadataEntity.youtubeUrl = youtubeUrl;
  nftItemMetadataEntity.chainId = chainId;
  nftItemMetadataEntity.contract = contract;
  nftItemMetadataEntity.tokenId = tokenId;
  if (tokenIdRangeObj) {
    nftItemMetadataEntity.tokenIdRange = saveTokenIdRange(tokenIdRangeObj);
  }
  nftItemMetadataEntity.terms = savedTermsIds;
  nftItemMetadataEntity.quantity = quantity;
  nftItemMetadataEntity.attributes = savedMetadataAttributeIds;
  nftItemMetadataEntity.bundle = bundleId;
  nftItemMetadataEntity.metadataUri = itemMetadataUri;

  nftItemMetadataEntity.save();
  return metadataId;
}
