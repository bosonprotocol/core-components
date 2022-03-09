import { ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Metadata } from "../../generated/schema";

export function saveIpfsMetadata(
  ipfsHash: string,
  offerId: string
): string | null {
  const offerMetadataId = offerId + "-metadata";

  const result = ipfs.cat(ipfsHash);

  if (result !== null) {
    const data = json.try_fromBytes(result);

    if (data.isOk && data.value.kind === JSONValueKind.OBJECT) {
      const dataObj = data.value.toObject();
      const title = dataObj.get("title");
      const description = dataObj.get("description");

      if (title && description) {
        const offerMetadata = new Metadata(offerMetadataId);
        offerMetadata.title = title.toString();
        offerMetadata.description = description.toString();
        offerMetadata.save();
        return offerMetadataId;
      }
    }
  }

  return null;
}
