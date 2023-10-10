import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import { useCallback, useMemo } from "react";

import { Props } from "./Finance";
import { saveItemInStorage } from "./storage/useLocalStorage";
import { SellerExchangeProps } from "./useSellerDeposit";
import { subgraph } from "@bosonprotocol/core-sdk";
import { getDateTimestamp } from "../../../lib/dates/getDateTimestamp";
import { Offer } from "../../../types/offer";
dayjs.extend(isBetween);

export default function useOffersBacked({
  funds: fundsData,
  exchangesTokens: exchangesTokensData,
  sellerDeposit: sellerDepositData
}: Pick<Props, "funds" | "exchangesTokens" | "sellerDeposit">) {
  const THRESHOLD = 15;

  const { funds } = fundsData;
  const { data: exchangesTokens } = exchangesTokensData;
  const { data: sellersData } = sellerDepositData;

  const calcOffersBacked = useMemo(() => {
    const offersBackedByGroup: { [key: string]: string } = {};
    if (!Array.isArray(exchangesTokens) || !exchangesTokens.length) {
      return offersBackedByGroup;
    }
    exchangesTokens?.forEach((exchangeToken) => {
      const key = exchangeToken?.symbol;
      const notExpiredAndNotVoidedOffers = exchangeToken?.offers?.filter(
        (offer: Offer) => {
          const now = dayjs();
          const validUntilDate = dayjs(getDateTimestamp(offer?.validUntilDate));
          const isNotExpired = validUntilDate.isAfter(now);
          return isNotExpired && !offer.voided;
        }
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // TODO: check
      const sumValue = notExpiredAndNotVoidedOffers?.reduce((acc, data) => {
        const { sellerDeposit, quantityAvailable } = data;
        acc = acc
          ? BigNumber.from(acc)
              .add(
                BigNumber.from(sellerDeposit).mul(
                  BigNumber.from(quantityAvailable)
                )
              )
              .toString()
          : BigNumber.from(sellerDeposit)
              .mul(BigNumber.from(quantityAvailable))
              .toString();
        return acc;
      }, "");
      offersBackedByGroup[key] = sumValue;
    });
    return offersBackedByGroup;
  }, [exchangesTokens]);

  const sellerLockedFunds = useMemo(() => {
    const lockedFundsByGroup: { [key: string]: string } = {};
    if (
      !sellersData?.exchanges ||
      !Array.isArray(sellersData?.exchanges) ||
      !sellersData?.exchanges.length
    ) {
      return lockedFundsByGroup;
    }

    const noFinalized =
      sellersData.exchanges?.filter(
        (exchange: SellerExchangeProps) => !exchange?.finalizedDate
      ) ?? [];

    const groupedBySymbol = groupBy(
      noFinalized,
      (exchange: SellerExchangeProps) => exchange?.offer?.exchangeToken?.symbol
    );
    Object.keys(groupedBySymbol).forEach((key) => {
      const element = groupedBySymbol[key];
      const sum = element.reduce((acc, elem) => {
        acc = acc
          ? BigNumber.from(acc)
              .add(BigNumber.from(elem.offer.sellerDeposit))
              .toString()
          : elem.offer.sellerDeposit;
        return acc;
      }, "");
      lockedFundsByGroup[key] = sum;
    });
    return lockedFundsByGroup;
  }, [sellersData]);

  const offersBackedFn = useCallback(
    (fund: subgraph.FundsEntityFieldsFragment) => {
      let result = null;
      const backedFund = calcOffersBacked[fund.token.symbol];
      if (fund.availableAmount && backedFund !== "") {
        result = Number(
          (
            (Number(fund.availableAmount) /
              Number(calcOffersBacked[fund.token.symbol])) *
            100
          ).toFixed(2)
        );
      }
      return result;
    },
    [calcOffersBacked]
  );

  const offersBacked = useMemo(
    () =>
      funds?.map((fund) => ({
        token: fund?.token?.symbol,
        value: offersBackedFn(fund)
      })),
    [funds, offersBackedFn]
  );

  const displayWarning = useMemo(() => {
    const anyValue = offersBacked.find(
      (v) => v?.value !== null && Number(v?.value) < THRESHOLD
    );
    const shouldDisplay = anyValue !== undefined;
    saveItemInStorage("shouldDisplayOfferBackedWarning", shouldDisplay);
    return shouldDisplay;
  }, [offersBacked]);

  if (exchangesTokensData.isLoading || sellerLockedFunds.isLoading) {
    return {
      offersBacked: [],
      calcOffersBacked: {},
      sellerLockedFunds: {},
      threshold: THRESHOLD,
      displayWarning,
      offersBackedFn
    };
  }

  return {
    offersBacked,
    calcOffersBacked,
    sellerLockedFunds,
    threshold: THRESHOLD,
    displayWarning,
    offersBackedFn
  };
}
