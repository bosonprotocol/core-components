import { subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";
import { CoreSdkConfig, useCoreSdk } from "./core-sdk/useCoreSdk";

export function useOffers(
  config: CoreSdkConfig,
  props: subgraph.GetOffersQueryQueryVariables,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSdk(config, undefined, options);
  return useQuery(
    ["offers", props, coreSDK],
    async () => {
      const offers = await coreSDK?.getOffers(props);

      return offers;
    },
    {
      ...options
    }
  );
}
