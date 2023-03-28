import { useContext, useEffect, useMemo, useState } from "react";
import {
  convertPrice,
  IPrice,
  IPricePassedAsAProp
} from "../../lib/price/convertPrice";
import { calcPrice } from "../../lib/price/prices";
import { useConfigContext } from "../config/ConfigContext";
import ConvertionRateContext from "../widgets/finance/convertion-rate/ConvertionRateContext";

interface Props {
  value: string;
  decimals: string;
  symbol: string;
}
export const useConvertedPrice = ({
  value,
  decimals,
  symbol
}: Props): IPrice => {
  const { store } = useContext(ConvertionRateContext);
  const { defaultCurrency } = useConfigContext();
  const [convertedPrice, setConvertedPrice] =
    useState<IPricePassedAsAProp | null>(null);

  const price = useMemo(() => calcPrice(value, decimals), [value, decimals]);

  useEffect(() => {
    const newPrice = convertPrice({
      price,
      symbol: symbol.toUpperCase(),
      currency: defaultCurrency,
      rates: store.rates,
      fixed: store.fixed
    });
    setConvertedPrice(newPrice);
  }, [price, symbol, store, defaultCurrency]);

  return {
    price,
    ...convertedPrice
  };
};
