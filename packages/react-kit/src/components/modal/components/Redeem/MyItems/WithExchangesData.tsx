import React, { useCallback, useMemo } from "react";
import {
  ExtendedExchange,
  useExchanges
} from "../../../../../hooks/useExchanges";
import {
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
}
export function WithExchangesData(
  WrappedComponent: React.ComponentType<WrappedComponentProps>
) {
  const ComponentWithExchangesData = (props: WithExchangesProps) => {
    const { buyerId } = props;
    const committedExchanges = useExchanges(
      { ...orderProps, disputed: null, buyerId },
      { enabled: !!buyerId }
    );

    const allExchanges = useMemo(() => {
      return [...(committedExchanges.data || [])];
    }, [committedExchanges.data]);

    const refetch = useCallback(() => {
      committedExchanges.refetch();
    }, [committedExchanges]);

    if (committedExchanges.isLoading) {
      return <Loading />;
    }

    if (committedExchanges.isError) {
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
