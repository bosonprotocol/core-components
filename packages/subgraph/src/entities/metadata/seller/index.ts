import { JSONValue, TypedMap, BigInt, log } from "@graphprotocol/graph-ts";

import { Seller, SellerMetadata } from "../../../../generated/schema";
import { convertToObjectArray, convertToString } from "../../../utils/json";
import { saveSellerMedias } from "./media";
import { saveContactLinks, saveSocialLinks } from "./links";
import { saveSalesChannels } from "./salesChannels";

export function getSellerMetadataEntityId(id: string): string {
  return `${id}-seller-metadata`;
}

export function saveInnerSellerMetadata(
  seller: Seller,
  metadataObj: TypedMap<string, JSONValue>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): string {
  const sellerId = seller.id.toString();
  const metadataId = getSellerMetadataEntityId(sellerId);

  const name = convertToString(metadataObj.get("name"));
  const description = convertToString(metadataObj.get("description"));
  const legalTradingName = convertToString(metadataObj.get("legalTradingName"));
  const kind = convertToString(metadataObj.get("kind"));
  const website = convertToString(metadataObj.get("website"));
  const images = convertToObjectArray(metadataObj.get("images"));
  const imagesId = saveSellerMedias(images);
  const contactLinks = convertToObjectArray(metadataObj.get("contactLinks"));
  const contactLinksId = saveContactLinks(contactLinks);
  const contactPreference = convertToString(
    metadataObj.get("contactPreference")
  );
  const socialLinks = convertToObjectArray(metadataObj.get("socialLinks"));
  const socialLinksId = saveSocialLinks(socialLinks);
  const salesChannels = convertToObjectArray(metadataObj.get("salesChannels"));
  const salesChannelsId = saveSalesChannels(sellerId, salesChannels);

  let sellerMetadata = SellerMetadata.load(metadataId);

  if (!sellerMetadata) {
    sellerMetadata = new SellerMetadata(metadataId);
  }
  sellerMetadata.createdAt = timestamp;
  sellerMetadata.name = name;
  sellerMetadata.description = description;
  sellerMetadata.legalTradingName = legalTradingName;
  sellerMetadata.kind = kind;
  sellerMetadata.website = website;
  sellerMetadata.images = imagesId;
  sellerMetadata.contactLinks = contactLinksId;
  sellerMetadata.contactPreference = contactPreference;
  sellerMetadata.socialLinks = socialLinksId;
  sellerMetadata.salesChannels = salesChannelsId;
  sellerMetadata.type = "SELLER";
  sellerMetadata.save();
  return metadataId;
}
