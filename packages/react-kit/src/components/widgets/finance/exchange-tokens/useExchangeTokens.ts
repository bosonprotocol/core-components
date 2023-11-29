import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../../../hooks/core-sdk/useCoreSdkWithContext";
import { fetchSubgraph } from "../../../../lib/subgraph/subgraph";
import { Offer } from "../../../../types/offer";

interface Props {
  sellerId: string;
}

interface Options {
  enabled?: boolean;
}
export interface ExchangeTokensProps {
  name: string;
  symbol: string;
  offers: Array<Offer>;
}
export function useExchangeTokens(props: Props, { enabled }: Options = {}) {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["exchangeTokens", props],
    async () => {
      const result = await fetchSubgraph<{
        exchangeTokens: ExchangeTokensProps[];
      }>(
        coreSDK.subgraphUrl,
        gql`
          query GetExchangesTokens($sellerId: String) {
            exchangeTokens {
              offers(where: { sellerId: $sellerId }) {
                id
                validFromDate
                validUntilDate
                voided
                price
                sellerDeposit
                quantityAvailable
              }
              name
              symbol
            }
          }
        `,
        { ...props }
      );
      return result?.exchangeTokens ?? [];
    },
    {
      enabled
    }
  );
}
