import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { ProductV1Media } from "../../../../generated/schema";

import { convertToInt, convertToString } from "../../../utils/json";

export function getMediaId(mediaUrl: string, mediaTag: string): string {
  return `${mediaUrl.toLowerCase()}-${mediaTag.toLowerCase()}`;
}

export function saveProductV1Medias(
  medias: Array<TypedMap<string, JSONValue>>,
  mediaType: string
): string[] {
  const savedMedias: string[] = [];

  for (let i = 0; i < medias.length; i++) {
    const mediaObject = medias[i];
    const mediaUrl = convertToString(mediaObject.get("url"));
    const mediaTag = convertToString(mediaObject.get("tag"));
    const mediaHeight = convertToInt(mediaObject.get("height"));
    const mediaWidth = convertToInt(mediaObject.get("width"));
    const mediaName = convertToString(mediaObject.get("name"));
    const mediaId = getMediaId(mediaUrl, mediaTag);

    let media = ProductV1Media.load(mediaId);

    if (!media) {
      media = new ProductV1Media(mediaId);
      media.url = mediaUrl;
      media.tag = mediaTag;
      media.height = mediaHeight;
      media.width = mediaWidth;
      media.name = mediaName;
      media.type = mediaType as string;
      media.save();
    }

    savedMedias.push(mediaId);
  }

  return savedMedias;
}
