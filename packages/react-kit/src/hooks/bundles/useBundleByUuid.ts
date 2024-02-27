import { useQuery } from "react-query";
import { CoreSDK } from "@bosonprotocol/core-sdk";

export function useBundleByUuid(
  sellerId: string | undefined | null,
  uuid: string | undefined | null,
  coreSDK: CoreSDK,
  options: {
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    ["get-bundle-by-uuid", uuid, coreSDK.uuid, sellerId],
    async () => {
      if (!uuid || !sellerId) {
        return;
      }
      return await coreSDK?.getBundleMetadataEntities({
        metadataFilter: {
          seller: sellerId,
          bundleUuid: uuid
        }
      });
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseBundleByUuid = ReturnType<typeof useBundleByUuid>["data"];
