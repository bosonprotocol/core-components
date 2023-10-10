import React, { useMemo } from "react";
import { IPrice } from "../../lib/price/convertPrice";
import { useDisplayFloat } from "../../lib/price/prices";
import { useConfigContext } from "../config/ConfigContext";

interface Props {
  price: IPrice;
  withParethensis?: boolean;
  isExchange?: boolean; // TODO: remove this prop
}

export default function ConvertedPrice({
  price,
  withParethensis,
  isExchange
}: Props) {
  const displayFloat = useDisplayFloat();
  const { defaultCurrency } = useConfigContext();
  const ConvertedPriceComponent = useMemo(
    () =>
      price?.converted && (
        <small
          style={{ marginLeft: isExchange ? "-1rem" : "0" }}
          data-converted-price
        >
          {"   "}
          <span>
            {withParethensis ? "(" : ""}
            {defaultCurrency.symbol}
          </span>{" "}
          <span>
            {displayFloat(price?.converted, {
              fixed: 2
            })}
            {withParethensis ? ")" : ""}
          </span>
        </small>
      ),
    [
      price?.converted,
      isExchange,
      withParethensis,
      defaultCurrency.symbol,
      displayFloat
    ]
  );
  return <>{ConvertedPriceComponent}</>;
}
