import {
  ipfs,
  json,
  JSONValue,
  JSONValueKind,
  TypedMap
} from "@graphprotocol/graph-ts";

export function getIpfsMetadataObject(
  ipfsHash: string
): TypedMap<string, JSONValue> | null {
  const result = ipfs.cat(ipfsHash);

  if (result !== null) {
    const data = json.try_fromBytes(result);

    if (data.isOk && data.value.kind === JSONValueKind.OBJECT) {
      const metadataObj = data.value.toObject();
      return metadataObj;
    }
  }

  return null;
}
