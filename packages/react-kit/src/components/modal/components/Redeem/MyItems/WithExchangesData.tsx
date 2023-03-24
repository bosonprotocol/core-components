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

const orderProps = {
  orderBy: Exchange_OrderBy.CommittedDate,
  orderDirection: OrderDirection.Desc
} as const;

interface WrappedComponentProps {
  exchanges: ExtendedExchange[];
  refetch: () => void;
}

interface WithExchangesProps {
  buyerId: string;
  committed: boolean;
  redeemed: boolean;
  disputed: boolean;
}
export function WithExchangesData(
  WrappedComponent: React.ComponentType<WrappedComponentProps>
) {
  const ComponentWithExchangesData = (props: WithExchangesProps) => {
    const { buyerId, committed, redeemed, disputed } = props;
    const committedExchanges = useExchanges(
      { ...orderProps, state: ExchangeState.Committed, buyerId },
      { enabled: !!buyerId && committed }
    );
    const disputedExchanges = useExchanges(
      { ...orderProps, state: ExchangeState.Disputed, buyerId },
      { enabled: !!buyerId && disputed }
    );
    const redeemedExchanges = useExchanges(
      { ...orderProps, state: ExchangeState.Redeemed, buyerId },
      { enabled: !!buyerId && redeemed }
    );

    const allExchanges = useMemo(() => {
      return [
        ...(committed ? committedExchanges.data || [] : []),
        ...(disputed ? disputedExchanges.data || [] : []),
        ...(redeemed ? redeemedExchanges.data || [] : [])
      ];
    }, [
      committedExchanges.data,
      committed,
      disputedExchanges.data,
      disputed,
      redeemedExchanges.data,
      redeemed
    ]);
    const refetch = useCallback(() => {
      committedExchanges.refetch();
      disputedExchanges.refetch();
      redeemedExchanges.refetch();
    }, [committedExchanges, disputedExchanges, redeemedExchanges]);

    if (
      committedExchanges.isLoading ||
      disputedExchanges.isLoading ||
      redeemedExchanges.isLoading
    ) {
      return <Loading />;
    }

    if (
      committedExchanges.isError ||
      disputedExchanges.isError ||
      redeemedExchanges.isError
    ) {
      return (
        <div data-testid="errorExchanges">
          There has been an error, please try again later...
        </div>
      );
    }

    if (!allExchanges?.length) {
      return <div>There are no exchanges</div>;
    }

    return (
      <WrappedComponent {...props} exchanges={allExchanges} refetch={refetch} />
    );
  };
  return ComponentWithExchangesData;
}
