import { log } from "@graphprotocol/graph-ts";
import { IBosonOfferHandler__getOfferResultOfferStruct } from "../../../generated/BosonOfferHandler/IBosonOfferHandler";
import { saveProductV1Metadata } from "./product-v1";
import { saveBaseMetadata } from "./base";
import { getIpfsMetadataObject, parseIpfsHash } from "../../utils/ipfs";
import { convertToString } from "../../utils/json";

export function saveMetadata(
  offerFromContract: IBosonOfferHandler__getOfferResultOfferStruct
): string | null {
  const ipfsHash = parseIpfsHash(offerFromContract.metadataUri);

  if (ipfsHash === null) {
    log.warning("Metadata URI does not contain supported CID: {}", [
      offerFromContract.metadataUri
    ]);
    return null;
  }

  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning("Could not load metadata for offer with id: {}, ipfsHash: {}", [
      offerFromContract.id.toString(),
      ipfsHash
    ]);
    return null;
  }

  const metadataType = convertToString(metadataObj.get("type"));

  if (metadataType == "BASE") {
    return saveBaseMetadata(offerFromContract, metadataObj);
  }

  if (metadataType == "PRODUCT_V1") {
    return saveProductV1Metadata(offerFromContract, metadataObj);
  }

  return null;
}
