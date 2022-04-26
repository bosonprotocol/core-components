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

export function parseIpfsHash(metadataUri: string): string | null {
  if (metadataUri.startsWith("ipfs://")) {
    return metadataUri.split("ipfs://")[1];
  }

  // CID v0
  if (metadataUri.startsWith("Qm") && metadataUri.length === 46) {
    return metadataUri;
  }

  // TODO: handle CID v1
  // TODO: handle different URIs

  return null;
}
