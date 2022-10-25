import { log, BigInt } from "@graphprotocol/graph-ts";
import { Offer } from "../../../generated/schema";
import { saveProductV1Metadata } from "./product-v1";
import { saveBaseMetadata } from "./base";
import { getIpfsMetadataObject, parseIpfsHash } from "../../utils/ipfs";
import { convertToString } from "../../utils/json";

// eslint-disable-next-line @typescript-eslint/ban-types
export function saveMetadata(offer: Offer, timestamp: BigInt): string | null {
  const ipfsHash = parseIpfsHash(offer.metadataUri);

  if (ipfsHash === null) {
    log.warning("Metadata URI does not contain supported CID: {}", [
      offer.metadataUri
    ]);
    return null;
  }

  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning("Could not load metadata for offer with id: {}, ipfsHash: {}", [
      offer.id.toString(),
      ipfsHash
    ]);
    return null;
  }

  const metadataType = convertToString(metadataObj.get("type"));

  if (metadataType == "BASE") {
    return saveBaseMetadata(offer, metadataObj, timestamp);
  }

  if (metadataType == "PRODUCT_V1") {
    return saveProductV1Metadata(offer, metadataObj, timestamp);
  }

  return null;
}
