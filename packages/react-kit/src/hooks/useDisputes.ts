import { subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";

export function useDisputes(
  props: subgraph.GetDisputesQueryQueryVariables,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["disputes", props],
    async () => {
      const disputes = await coreSDK?.getDisputes(props);

      return disputes;
    },
    {
      ...options
    }
  );
}
