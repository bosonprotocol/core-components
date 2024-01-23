import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { ProductV1Media } from "../../../../generated/schema";

import { convertToInt, convertToString } from "../../../utils/json";

export function getMediaId(mediaUrl: string, mediaTag: string): string {
  return `${mediaUrl.toLowerCase()}-${mediaTag.toLowerCase()}`;
}

export function saveProductV1Medias(
  medias: Array<TypedMap<string, JSONValue>>,
  mediaType: string,
  additionalMediaUrl: string = ""
): string[] {
  const savedMedias: string[] = [];
  let addAdditionalMediaUrl = (additionalMediaUrl !== "")

  for (let i = 0; i < medias.length; i++) {
    const mediaObject = medias[i];
    const mediaUrl = convertToString(mediaObject.get("url"));

    if (mediaUrl.toLowerCase() == additionalMediaUrl.toLowerCase()) {
      addAdditionalMediaUrl = false;
    }
    const mediaTag = convertToString(mediaObject.get("tag"));
    const mediaHeight = convertToInt(mediaObject.get("height"));
    const mediaWidth = convertToInt(mediaObject.get("width"));
    const mediaId = getMediaId(mediaUrl, mediaTag);

    let media = ProductV1Media.load(mediaId);

    if (media) {
      media.height = mediaHeight;
      media.width = mediaWidth;
    } else {
      media = new ProductV1Media(mediaId);
      media.url = mediaUrl;
      media.tag = mediaTag;
      media.height = mediaHeight;
      media.width = mediaWidth;
      media.type = mediaType as string;
    }
    media.save();

    savedMedias.push(mediaId);
  }

  if (addAdditionalMediaUrl) {
    const mediaTag = "";
    const mediaId = getMediaId(additionalMediaUrl, mediaTag);

    let media = ProductV1Media.load(mediaId);

    if (!media) {
      media = new ProductV1Media(mediaId);
      media.url = additionalMediaUrl;
      media.tag = mediaTag;
      media.type = mediaType as string;
    }
    media.save();

    savedMedias.push(mediaId);
  }

  return savedMedias;
}
