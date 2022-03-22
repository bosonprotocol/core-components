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
      const additionalProperties = dataObj.get("additionalProperties");

      if (title && description) {
        const offerMetadata = new Metadata(offerMetadataId);
        offerMetadata.title = title.toString();
        offerMetadata.description = description.toString();

        if (
          additionalProperties !== null &&
          additionalProperties.kind === JSONValueKind.STRING
        ) {
          offerMetadata.additionalProperties = additionalProperties.toString();
        }

        offerMetadata.save();
        return offerMetadataId;
      }
    }
  }

  return null;
}
