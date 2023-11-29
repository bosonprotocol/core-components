import { subgraph } from "@bosonprotocol/core-sdk";
import {
  Exchange_Filter,
  Exchange_OrderBy,
  OrderDirection
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useQuery } from "react-query";
import { Offer } from "../types/offer";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";

export type Disputes = subgraph.DisputeFieldsFragment & {
  exchange: { offer: Offer } & subgraph.ExchangeFieldsFragment;
};

interface Props extends Exchange_Filter {
  orderBy?: Exchange_OrderBy | null | undefined;
  orderDirection?: OrderDirection | null | undefined;
}
export type ExtendedExchange = NonNullable<
  ReturnType<typeof useExchanges>["data"]
>[number];
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
      const { orderBy, orderDirection, ...exchangeFilter } = props;
      const filter: Exchange_Filter = {
        ...exchangeFilter
      };
      const data = await coreSDK.getExchanges({
        exchangesFilter: filter,
        exchangesFirst: OFFERS_PER_PAGE,
        exchangesOrderBy: orderBy,
        exchangesOrderDirection: orderDirection
      });
      let loop = data?.length === OFFERS_PER_PAGE;
      let productsSkip = OFFERS_PER_PAGE;
      while (loop) {
        const dataToAdd = await coreSDK.getExchanges({
          exchangesFilter: filter,
          exchangesFirst: OFFERS_PER_PAGE,
          exchangesOrderBy: orderBy,
          exchangesOrderDirection: orderDirection,
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
