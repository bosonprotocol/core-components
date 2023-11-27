import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../useCoreSdkWithContext";

export default function useProductByUuid(
  sellerId: string | undefined | null,
  uuid: string | undefined | null,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDKWithContext();

  return useQuery(
    ["get-product-by-uuid", uuid, coreSDK, sellerId],
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
