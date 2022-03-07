import { ipfs, JSONValue, Value } from "@graphprotocol/graph-ts";
import { Metadata } from "../../generated/schema";

export function saveIpfsMetadata(
  ipfsHash: string,
  offerId: string
): string | null {
  const offerMetadataId = offerId.toString() + "-metadata";

  // TODO: re-enable and test when using hosted service. does not work with local setup.
  // ipfs.mapJSON(
  //   ipfsHash,
  //   "processIpfsMetadata",
  //   Value.fromString(offerMetadataId)
  // );

  return offerMetadataId;
}

export function processIpfsMetadata(value: JSONValue, userData: Value): void {
  const obj = value.toObject();
  const title = obj.get("title");
  const description = obj.get("description");

  if (title && description) {
    const metadata = new Metadata(userData.toString());
    metadata.title = title.toString();
    metadata.description = description.toString();
    metadata.save();
  }
}
