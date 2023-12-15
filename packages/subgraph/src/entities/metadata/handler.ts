import { log, BigInt } from "@graphprotocol/graph-ts";
import { Offer, Seller } from "../../../generated/schema";
import { saveProductV1Metadata } from "./product-v1";
import { saveBaseMetadata } from "./base";
import { getIpfsMetadataObject, parseIpfsHash } from "../../utils/ipfs";
import { convertToString } from "../../utils/json";
import { saveInnerSellerMetadata } from "./seller";
import { saveInnerNftContractMetadata } from "./nft-contract";

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

export function saveSellerMetadata(
  seller: Seller,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): string | null {
  const ipfsHash = parseIpfsHash(seller.metadataUri);

  if (ipfsHash === null) {
    log.warning("Metadata URI does not contain supported CID: {}", [
      seller.metadataUri
    ]);
    return null;
  }
  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning(
      "Could not load metadata for seller with id: {}, ipfsHash: {}",
      [seller.id.toString(), ipfsHash]
    );
    return null;
  }
  const metadataType = convertToString(metadataObj.get("type"));

  if (metadataType == "SELLER") {
    return saveInnerSellerMetadata(seller, metadataObj, timestamp);
  }

  return null;
}

export function saveCollectionMetadata(
  collectionId: string,
  collectionMetadataUri: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): void {
  if (collectionMetadataUri === "") {
    return;
  }
  const ipfsHash = parseIpfsHash(collectionMetadataUri);

  if (ipfsHash === null || ipfsHash === "") {
    log.warning("Collection metadata URI does not contain supported CID: {}", [
      collectionMetadataUri
    ]);
    return;
  }
  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning("Could not load collection metadata with ipfsHash: {}", [
      ipfsHash
    ]);
    return;
  }
  saveInnerNftContractMetadata(collectionId, metadataObj, timestamp);
}
