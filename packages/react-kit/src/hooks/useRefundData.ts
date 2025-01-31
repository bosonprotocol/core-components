import { useContext, useMemo } from "react";
import { useConfigContext } from "../components/config/ConfigContext";
import ConvertionRateContext from "../components/widgets/finance/convertion-rate/ConvertionRateContext";
import { convertPrice } from "../lib/price/convertPrice";
import {
  calcPrice,
  getCalcPercentage,
  useDisplayFloatWithConfig
} from "../lib/price/prices";
import { subgraph } from "@bosonprotocol/core-sdk";

export default function useRefundData(
  exchange: subgraph.ExchangeFieldsFragment,
  price: string
) {
  const { store } = useContext(ConvertionRateContext);
  const { offer } = exchange;
  const { defaultCurrency } = useConfigContext();

  const priceValue = useMemo(
    () => calcPrice(price, offer.exchangeToken.decimals),
    [price, offer.exchangeToken.decimals]
  );
  const priceConverted = useMemo(
    () =>
      convertPrice({
        price: priceValue,
        symbol: offer.exchangeToken.symbol,
        currency: defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [
      priceValue,
      store.rates,
      store.fixed,
      offer.exchangeToken.symbol,
      defaultCurrency
    ]
  );
  const displayFloat = useDisplayFloatWithConfig();
  const calcPercentage = getCalcPercentage(displayFloat);
  const penalty = calcPercentage(offer, "buyerCancelPenalty");
  const penaltyPrice = useMemo(
    () =>
      calcPrice(
        (Number(price) * penalty.percentage).toString(),
        offer.exchangeToken.decimals
      ),
    [price, penalty.percentage, offer.exchangeToken.decimals]
  );
  const penaltyConverted = useMemo(
    () =>
      convertPrice({
        price: penaltyPrice,
        symbol: offer.exchangeToken.symbol,
        currency: defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [
      penaltyPrice,
      store.rates,
      store.fixed,
      offer.exchangeToken.symbol,
      defaultCurrency
    ]
  );

  const refundPrice = useMemo(
    () =>
      calcPrice(
        (
          Number(price) -
          (Number(price) * Number(penalty.percentage || 0)) / 100
        ).toString(),
        offer.exchangeToken.decimals
      ),
    [price, offer.exchangeToken.decimals, penalty.percentage]
  );
  const refundConverted = useMemo(
    () =>
      convertPrice({
        price: refundPrice.toString(),
        symbol: offer.exchangeToken.symbol,
        currency: defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [
      refundPrice,
      store.rates,
      store.fixed,
      offer.exchangeToken.symbol,
      defaultCurrency
    ]
  );

  return {
    currency: offer.exchangeToken.symbol,
    price: {
      value: priceValue,
      show: !!priceConverted,
      converted: {
        value: priceConverted.converted,
        currency: priceConverted.currency.symbol
      }
    },
    penalty: {
      value: penalty.percentage,
      show: !!penaltyConverted,
      converted: {
        value: penaltyConverted.converted,
        currency: penaltyConverted.currency.symbol
      }
    },
    refund: {
      value: refundPrice,
      show: !!refundConverted,
      converted: {
        value: refundConverted.converted,
        currency: refundConverted.currency.symbol
      }
    }
  };
}
