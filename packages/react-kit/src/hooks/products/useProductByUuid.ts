import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export function useProductByUuid(
  sellerId: string | undefined | null,
  uuid: string | undefined | null,
  coreSDK: CoreSDK,
  options: {
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    ["get-product-by-uuid", uuid, coreSDK.uuid, sellerId],
    async () => {
      if (!uuid || !sellerId) {
        return;
      }
      return await coreSDK?.getProductWithVariants(sellerId, uuid);
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseProductByUuid = ReturnType<
  typeof useProductByUuid
>["data"];
