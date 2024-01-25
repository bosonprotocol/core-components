import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../core-sdk/useCoreSdkWithContext";

export default function useProductByOfferId(
  offerId: string | undefined | null,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDKWithContext();

  return useQuery(
    ["get-product-by-offerId", offerId, coreSDK.uuid],
    async () => {
      if (!offerId) {
        return;
      }
      return await coreSDK?.getProductWithVariantsFromOfferId(offerId);
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK
    }
  );
}

export type ReturnUseProductByOfferId = ReturnType<
  typeof useProductByOfferId
>["data"];
