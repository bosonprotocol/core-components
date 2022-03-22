import { useEffect, useState } from "react";
import { CoreSDK } from "@bosonprotocol/core-sdk";

export type ValidationError = Error & {
  errors: string[];
  value: Record<string, unknown>;
};

export function useMetadata({
  coreSDK,
  metadataHash
}: {
  metadataHash: string;
  coreSDK: CoreSDK;
}) {
  const [metadata, setMetadata] = useState<Record<string, string>>();
  const [error, setError] = useState<undefined | Error | ValidationError>();

  useEffect(() => {
    coreSDK.getMetadata(metadataHash).then(setMetadata).catch(setError);
  }, [coreSDK, metadataHash]);

  return { metadata, error };
}
