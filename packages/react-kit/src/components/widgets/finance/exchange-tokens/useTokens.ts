import { Offer } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../../../hooks/core-sdk/useCoreSdkWithContext";
import { fetchSubgraph } from "../../../../lib/subgraph/subgraph";

export function useTokens(
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    "tokens",
    async () => {
      const result = await fetchSubgraph<{
        exchangeTokens: Pick<Offer["exchangeToken"], "address" | "symbol">[];
      }>(
        coreSDK.subgraphUrl,
        gql`
          {
            exchangeTokens(orderBy: "symbol", orderDirection: asc) {
              address
              name
              symbol
              decimals
            }
          }
        `
      );
      return result?.exchangeTokens ?? [];
    },
    {
      ...options
    }
  );
}
