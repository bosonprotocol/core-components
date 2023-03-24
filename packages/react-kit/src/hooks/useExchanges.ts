import { subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";
import { Offer } from "../types/offer";
import { useCoreSDKWithContext } from "./useCoreSdkWithContext";

export type Disputes = subgraph.DisputeFieldsFragment & {
  exchange: { offer: Offer } & subgraph.ExchangeFieldsFragment;
};

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  state?: subgraph.ExchangeState;
  id?: string;
  id_in?: string[];
  orderBy?: string | null | undefined;
  orderDirection?: string | null | undefined;
  offerId?: string;
  first?: number;
  skip?: number;
}

const OFFERS_PER_PAGE = 1000;
export function useExchanges(
  props: Props,
  options: {
    enabled?: boolean;
  } = {}
) {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["exchanges", props],
    async () => {
      const data = await coreSDK.getExchanges({
        exchangesFilter: {
          ...props
        },
        exchangesFirst: OFFERS_PER_PAGE
      });
      let loop = data?.length === OFFERS_PER_PAGE;
      let productsSkip = OFFERS_PER_PAGE;
      while (loop) {
        const dataToAdd = await coreSDK.getExchanges({
          exchangesFilter: {
            ...props
          },
          exchangesFirst: OFFERS_PER_PAGE,
          exchangesSkip: productsSkip
        });
        data.push(...dataToAdd);
        loop = dataToAdd?.length === OFFERS_PER_PAGE;
        productsSkip += OFFERS_PER_PAGE;
      }
      return (
        data?.map((exchange) => {
          return {
            ...exchange,
            offer: {
              ...exchange.offer,
              metadata: {
                ...exchange.offer.metadata,
                imageUrl: exchange.offer.metadata?.image || ""
              }
            } as Offer
          };
        }) ?? []
      );
    },
    {
      ...options
    }
  );
}
