import { useEffect, useState } from "react";
import { CoreSDK } from "@bosonprotocol/core-sdk";

export function useMetadata({
  coreSDK,
  metadataHash
}: {
  metadataHash: string;
  coreSDK: CoreSDK;
}) {
  const [metadata, setMetadata] = useState<Record<string, string>>();
  const [error, setError] = useState<undefined | Error>();

  useEffect(() => {
    coreSDK.getMetadata(metadataHash).then(setMetadata).catch(setError);
  }, [coreSDK, metadataHash]);

  return { metadata, error };
}
