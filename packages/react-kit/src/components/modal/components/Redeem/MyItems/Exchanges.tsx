import React from "react";
import { ExtendedExchange } from "../../../../../hooks/useExchanges";
import { Exchange as IExchange } from "../../../../../types/exchange";
import Exchange from "./Exchange";
import { ProductGridContainer } from "./ProfilePage.styles";
interface Props {
  refetch: () => void;
  onCardClick: (exchange: IExchange) => void;
  exchanges: ExtendedExchange[];
}

export default function Exchanges({ refetch, exchanges, onCardClick }: Props) {
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
      {exchanges?.map((exchange) => {
        return (
          <Exchange
            key={exchange.id}
            offer={exchange.offer}
            exchange={exchange}
            refetch={refetch}
            onCardClick={onCardClick}
          />
        );
      })}
    </ProductGridContainer>
  );
}
