import { log } from "@graphprotocol/graph-ts";
import { saveProductV1Metadata } from "./product-v1";
import { saveBaseMetadata } from "./base";
import { getIpfsMetadataObject, parseIpfsHash } from "../../utils/ipfs";
import { convertToString } from "../../utils/json";

export function saveMetadata(
  metadataUri: string,
  offerId: string,
  sellerId: string
): string | null {
  const ipfsHash = parseIpfsHash(metadataUri);

  if (ipfsHash === null) {
    log.warning("Metadata URI does not contain supported CID: {}", [
      metadataUri
    ]);
    return null;
  }

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
    return saveBaseMetadata(offerId, sellerId, metadataObj);
  }

  if (metadataType == "PRODUCT_V1") {
    return saveProductV1Metadata(offerId, sellerId, metadataObj);
  }

  return null;
}
