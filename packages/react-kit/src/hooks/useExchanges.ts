import { subgraph } from "@bosonprotocol/core-sdk";
import {
  Exchange_Filter,
  Exchange_OrderBy,
  OrderDirection
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
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
  orderBy?: Exchange_OrderBy | null | undefined;
  orderDirection?: OrderDirection | null | undefined;
  offerId?: string;
  first?: number;
  skip?: number;
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
      const filter: Exchange_Filter = {
        id: props.id,
        state: props.state,
        id_in: props.id_in,
        seller: props.sellerId,
        buyer: props.buyerId,
        ...([true, false].includes(props.disputed as boolean) && {
          disputed: props.disputed
        }),
        offer: props.offerId
      };
      const data = await coreSDK.getExchanges({
        exchangesFilter: filter,
        exchangesFirst: OFFERS_PER_PAGE,
        exchangesOrderBy: props.orderBy,
        exchangesOrderDirection: props.orderDirection
      });
      let loop = data?.length === OFFERS_PER_PAGE;
      let productsSkip = OFFERS_PER_PAGE;
      while (loop) {
        const dataToAdd = await coreSDK.getExchanges({
          exchangesFilter: filter,
          exchangesFirst: OFFERS_PER_PAGE,
          exchangesOrderBy: props.orderBy,
          exchangesOrderDirection: props.orderDirection,
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
