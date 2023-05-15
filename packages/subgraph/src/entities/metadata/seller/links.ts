import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import {
  SellerContactLink,
  SellerSocialLink
} from "../../../../generated/schema";

import { convertToString } from "../../../utils/json";

export function getContactLinkId(
  contactLink: string,
  contactLinkTag: string
): string {
  return `${contactLink.toLowerCase()}-${contactLinkTag.toLowerCase()}-contact-link`;
}

export function saveContactLinks(
  contactLinks: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedContactLinks: string[] = [];

  for (let i = 0; i < contactLinks.length; i++) {
    const contactLink = contactLinks[i];
    const url = convertToString(contactLink.get("url"));
    const tag = convertToString(contactLink.get("tag"));
    const id = getContactLinkId(url, tag);

    let sellerContactLink = SellerContactLink.load(id);

    if (!sellerContactLink) {
      sellerContactLink = new SellerContactLink(id);
      sellerContactLink.url = url;
      sellerContactLink.tag = tag;
    }
    sellerContactLink.save();

    savedContactLinks.push(id);
  }

  return savedContactLinks;
}

export function getSocialLinkId(
  socialLink: string,
  SocialLinkTag: string
): string {
  return `${socialLink.toLowerCase()}-${SocialLinkTag.toLowerCase()}-social-link`;
}

export function saveSocialLinks(
  socialLinks: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedSocialLinks: string[] = [];

  for (let i = 0; i < socialLinks.length; i++) {
    const socialLink = socialLinks[i];
    const url = convertToString(socialLink.get("url"));
    const tag = convertToString(socialLink.get("tag"));
    const id = getSocialLinkId(url, tag);

    let sellerSocialLink = SellerSocialLink.load(id);

    if (!sellerSocialLink) {
      sellerSocialLink = new SellerSocialLink(id);
      sellerSocialLink.url = url;
      sellerSocialLink.tag = tag;
    }
    sellerSocialLink.save();

    savedSocialLinks.push(id);
  }

  return savedSocialLinks;
}
