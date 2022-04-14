import { log } from "@graphprotocol/graph-ts";
import { saveProductV1Metadata } from "./product-v1";
import { saveBaseMetadata } from "./base";
import { getIpfsMetadataObject } from "../../utils/ipfs";
import { convertToString } from "../../utils/json";

export function saveMetadata(
  ipfsHash: string,
  offerId: string,
  seller: string
): string | null {
  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning("Could not load metadata for offer with id: {}, ipfsHash: {}", [
      offerId,
      ipfsHash
    ]);
    return null;
  }

  const metadataType = convertToString(metadataObj.get("type"));

  if (metadataType == "BASE") {
    return saveBaseMetadata(offerId, seller, metadataObj);
  }

  if (metadataType == "PRODUCT_V1") {
    return saveProductV1Metadata(offerId, seller, metadataObj);
  }

  return null;
}
