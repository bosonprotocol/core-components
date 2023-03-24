import React from "react";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { Spinner } from "../../../../ui/loading/Spinner";
import Exchange from "./Exchange";
import { LoadingWrapper, ProductGridContainer } from "./ProfilePage.styles";
import { Exchange as IExchange } from "../../../../../types/exchange";
interface Props {
  buyerId: string;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Exchanges({ buyerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading,
    isError,
    refetch
  } = useExchanges(
    { ...orderProps, disputed: null, buyerId },
    { enabled: !!buyerId }
  );

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner size={42} />
      </LoadingWrapper>
    );
  }

  if (isError) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchangesSeller?.length) {
    return <div>There are no exchanges</div>;
  }

  return (
    <ProductGridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    >
      {exchangesSeller?.map((exchange) => {
        return (
          <Exchange
            key={exchange.id}
            {...exchange}
            exchange={exchange as IExchange}
            reload={refetch}
          />
        );
      })}
    </ProductGridContainer>
  );
}
