import { JSONValue, TypedMap, BigInt, log } from "@graphprotocol/graph-ts";

import { Seller, SellerMetadata } from "../../../../generated/schema";
import { convertToObjectArray, convertToString } from "../../../utils/json";
import { saveSellerMedias } from "./media";
import { saveContactLinks, saveSocialLinks } from "./links";

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
  const website = convertToString(metadataObj.get("website"));
  const images = convertToObjectArray(metadataObj.get("images"));
  const imagesId = saveSellerMedias(images, "IMAGE");
  const contactLinks = convertToObjectArray(metadataObj.get("contactLinks"));
  const contactLinksId = saveContactLinks(contactLinks);
  const contactPreference = convertToString(
    metadataObj.get("contactPreference")
  );
  const socialLinks = convertToObjectArray(metadataObj.get("socialLinks"));
  const socialLinksId = saveSocialLinks(socialLinks);

  let sellerMetadata = SellerMetadata.load(metadataId);

  if (!sellerMetadata) {
    sellerMetadata = new SellerMetadata(metadataId);
  }
  sellerMetadata.createdAt = timestamp;
  sellerMetadata.name = name;
  sellerMetadata.description = description;
  sellerMetadata.legalTradingName = legalTradingName;
  sellerMetadata.website = website;
  sellerMetadata.images = imagesId;
  sellerMetadata.contactLinks = contactLinksId;
  sellerMetadata.contactPreference = contactPreference;
  sellerMetadata.socialLinks = socialLinksId;
  sellerMetadata.type = "SELLER";
  sellerMetadata.save();
  return metadataId;
}
