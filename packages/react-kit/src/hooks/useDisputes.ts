import { subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "./useCoreSdkWithContext";

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
