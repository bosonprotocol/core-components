import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import {
  ProductV1SellerContactLink,
  ProductV1Seller
} from "../../../../generated/schema";

import {
  convertToInt,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import { saveProductV1Medias } from "./media";

export function getProductV1SellerId(sellerAccountId: string): string {
  return `${sellerAccountId}-product-v1`;
}

export function geContactLinkId(url: string, tag: string): string {
  return `${url.toLowerCase()}-${tag.toLowerCase()}`;
}

export function saveProductV1Seller(
  sellerObj: TypedMap<string, JSONValue> | null,
  sellerAccountId: string
): string | null {
  if (sellerObj === null) {
    return null;
  }

  const defaultVersion = convertToInt(sellerObj.get("defaultVersion"));
  const name = convertToString(sellerObj.get("name"));
  const description = convertToString(sellerObj.get("description"));
  const externalUrl = convertToString(sellerObj.get("externalUrl"));
  const tokenId = convertToString(sellerObj.get("tokenId"));
  const images = convertToObjectArray(sellerObj.get("images"));
  const savedImageIds = saveProductV1Medias(images, "IMAGE");
  const contactLinks = convertToObjectArray(sellerObj.get("contactLinks"));
  const savedContactLinkIds = saveProductV1SellerContactLink(contactLinks);

  const productV1SellerId = getProductV1SellerId(sellerAccountId);

  let productV1Seller = ProductV1Seller.load(productV1SellerId);

  if (!productV1Seller) {
    productV1Seller = new ProductV1Seller(productV1SellerId);
  }

  productV1Seller.defaultVersion = defaultVersion;
  productV1Seller.name = name;
  productV1Seller.description = description;
  productV1Seller.externalUrl = externalUrl;
  productV1Seller.tokenId = tokenId;
  productV1Seller.sellerId = sellerAccountId;
  productV1Seller.images = savedImageIds;
  productV1Seller.contactLinks = savedContactLinkIds;
  productV1Seller.seller = sellerAccountId;

  productV1Seller.save();
  return productV1SellerId;
}

function saveProductV1SellerContactLink(
  contactLinks: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedContactLinks: string[] = [];

  for (let i = 0; i < contactLinks.length; i++) {
    const contactLinkObject = contactLinks[i];
    const contactLinkUrl = convertToString(contactLinkObject.get("url"));
    const contactLinkTag = convertToString(contactLinkObject.get("tag"));
    const contactLinkId = geContactLinkId(contactLinkUrl, contactLinkTag);

    let contactLink = ProductV1SellerContactLink.load(contactLinkId);

    if (!contactLink) {
      contactLink = new ProductV1SellerContactLink(contactLinkId);
      contactLink.url = contactLinkUrl;
      contactLink.tag = contactLinkTag;
      contactLink.save();
    }

    savedContactLinks.push(contactLinkId);
  }

  return savedContactLinks;
}
