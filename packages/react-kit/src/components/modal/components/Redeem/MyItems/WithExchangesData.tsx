import React, { useCallback, useMemo } from "react";
import {
  ExtendedExchange,
  useExchanges
} from "../../../../../hooks/useExchanges";
import {
  ExchangeState,
  Exchange_OrderBy,
  OrderDirection
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import Loading from "../../../../ui/loading/Loading";
import { Exchange } from "../../../../../types/exchange";
import { useCurationLists } from "../../../../../hooks/useCurationLists";

const orderProps = {
  orderBy: Exchange_OrderBy.CommittedDate,
  orderDirection: OrderDirection.Desc
} as const;

interface CommonProps {
  onCardClick: (exchange: Exchange) => void;
  onRedeemClick: (exchange: Exchange) => void;
  onCancelExchangeClick: (exchange: Exchange) => void;
  onRaiseDisputeClick: (exchange: Exchange) => void;
  onAvatarClick: (exchange: Exchange) => void;
}

interface WrappedComponentProps extends CommonProps {
  exchanges: ExtendedExchange[];
  refetch: () => void;
}
export interface ExchangesStates {
  committed: boolean;
  redeemed: boolean;
  disputed: boolean;
  completed: boolean;
}
interface WithExchangesProps extends CommonProps, ExchangesStates {
  buyerId: string;
}
export function WithExchangesData(
  WrappedComponent: React.ComponentType<WrappedComponentProps>
) {
  const ComponentWithExchangesData = (props: WithExchangesProps) => {
    const { buyerId, committed, redeemed, disputed, completed } = props;
    const { enableCurationLists, offerCurationList, sellerCurationList } =
      useCurationLists();
    const committedExchanges = useExchanges(
      {
        ...orderProps,
        state: ExchangeState.Committed,
        buyer: buyerId,
        ...(enableCurationLists && {
          offer_in: offerCurationList,
          seller_in: sellerCurationList
        })
      },
      { enabled: !!buyerId && committed }
    );
    const cancelledExchanges = useExchanges(
      {
        ...orderProps,
        state: ExchangeState.Cancelled,
        buyer: buyerId,
        ...(enableCurationLists && {
          offer_in: offerCurationList,
          seller_in: sellerCurationList
        })
      },
      { enabled: !!buyerId && committed }
    );
    const disputedExchanges = useExchanges(
      {
        ...orderProps,
        state: ExchangeState.Disputed,
        buyer: buyerId,
        ...(enableCurationLists && {
          offer_in: offerCurationList,
          seller_in: sellerCurationList
        })
      },
      { enabled: !!buyerId && disputed }
    );
    const redeemedExchanges = useExchanges(
      {
        ...orderProps,
        state: ExchangeState.Redeemed,
        buyer: buyerId,
        ...(enableCurationLists && {
          offer_in: offerCurationList,
          seller_in: sellerCurationList
        })
      },
      { enabled: !!buyerId && redeemed }
    );
    const completedExchanges = useExchanges(
      {
        ...orderProps,
        state: ExchangeState.Completed,
        buyer: buyerId,
        ...(enableCurationLists && {
          offer_in: offerCurationList,
          seller_in: sellerCurationList
        })
      },
      { enabled: !!buyerId && completed }
    );

    const allExchanges = useMemo(() => {
      return [
        ...(committed ? committedExchanges.data || [] : []),
        ...(committed ? cancelledExchanges.data || [] : []),
        ...(disputed ? disputedExchanges.data || [] : []),
        ...(redeemed ? redeemedExchanges.data || [] : []),
        ...(completed ? completedExchanges.data || [] : [])
      ];
    }, [
      committedExchanges.data,
      cancelledExchanges.data,
      committed,
      disputedExchanges.data,
      disputed,
      redeemedExchanges.data,
      redeemed,
      completed,
      completedExchanges.data
    ]);
    const refetch = useCallback(() => {
      committedExchanges.refetch();
      cancelledExchanges.refetch();
      disputedExchanges.refetch();
      redeemedExchanges.refetch();
      completedExchanges.refetch();
    }, [
      committedExchanges,
      cancelledExchanges,
      disputedExchanges,
      redeemedExchanges,
      completedExchanges
    ]);

    if (
      committedExchanges.isFetching ||
      cancelledExchanges.isFetching ||
      disputedExchanges.isFetching ||
      redeemedExchanges.isFetching ||
      completedExchanges.isFetching
    ) {
      return <Loading />;
    }

    if (
      committedExchanges.isError ||
      cancelledExchanges.isError ||
      disputedExchanges.isError ||
      redeemedExchanges.isError ||
      completedExchanges.isError
    ) {
      return (
        <div data-testid="errorExchanges">
          There has been an error, please try again later...
        </div>
      );
    }

    if (!allExchanges?.length) {
      return <div>No exchanges</div>;
    }

    return (
      <WrappedComponent {...props} exchanges={allExchanges} refetch={refetch} />
    );
  };
  return ComponentWithExchangesData;
}