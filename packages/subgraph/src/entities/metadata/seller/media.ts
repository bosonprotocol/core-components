import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { SellerMetadataMedia } from "../../../../generated/schema";

import { convertToInt, convertToString } from "../../../utils/json";

export function getMediaId(mediaUrl: string, mediaTag: string): string {
  return `${mediaUrl.toLowerCase()}-${mediaTag.toLowerCase()}`;
}

export function saveSellerMedias(
  medias: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedMedias: string[] = [];

  for (let i = 0; i < medias.length; i++) {
    const mediaObject = medias[i];
    const mediaUrl = convertToString(mediaObject.get("url"));
    const mediaTag = convertToString(mediaObject.get("tag"));
    const mediaHeight = convertToInt(mediaObject.get("height"));
    const mediaWidth = convertToInt(mediaObject.get("width"));
    const mediaType = convertToString(mediaObject.get("type"));
    const mediaId = getMediaId(mediaUrl, mediaTag);

    let media = SellerMetadataMedia.load(mediaId);

    if (media) {
      media.height = mediaHeight;
      media.width = mediaWidth;
      media.type = mediaType;
    } else {
      media = new SellerMetadataMedia(mediaId);
      media.url = mediaUrl;
      media.tag = mediaTag;
      media.height = mediaHeight;
      media.width = mediaWidth;
      media.type = mediaType;
    }
    media.save();

    savedMedias.push(mediaId);
  }

  return savedMedias;
}
