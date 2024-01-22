import dayjs from "dayjs";
import React, { useMemo } from "react";
import useTransactionHistory from "../../../../../hooks/useTransactionHistory";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import { IPrice } from "../../../../../lib/price/convertPrice";
import { Exchange } from "../../../../../types/exchange";
import { Offer } from "../../../../../types/offer";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import { Typography } from "../../../../ui/Typography";

import { Transactions } from "./Detail.style";
const HEADER = ["Event", "From", "To", "Price", "Date"];
interface Props {
  offer: Offer;
  exchange: Exchange;
  title?: string;
  buyerAddress: string;
}

interface ITransactionHistory {
  event: string;
  from: string;
  to: string;
  price?: string | null | undefined;
  currency?: string | null;
  timestamp: number;
}

interface IHandleRows {
  timesteps: {
    text: string;
    date: string;
    timestamp: number;
  }[];
  price: IPrice | null;
  to: string;
  currency: string;
}

const handleRows = ({
  timesteps,
  price,
  to,
  currency
}: IHandleRows): ITransactionHistory[] => {
  return timesteps.map((timestep, index) => ({
    event: timestep.text,
    from: "-",
    to: index === 0 ? to : "-",
    price: index === 0 ? price?.price : null,
    currency: index === 0 ? currency : null,
    timestamp: timestep.timestamp
  }));
};

export default function DetailTransactions({
  exchange,
  offer,
  title,
  buyerAddress
}: Props) {
  const { timesteps } = useTransactionHistory({
    exchangeId: exchange.id,
    tense: "present"
  });
  const price = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const to = `${buyerAddress.substring(0, 5)}...${buyerAddress.substring(
    buyerAddress.length - 4
  )}`;
  const currency = offer.exchangeToken.symbol;
  const allRows = useMemo(() => {
    return handleRows({ timesteps, price, to, currency });
  }, [timesteps, currency, price, to]);

  return (
    <div style={{ width: "100%" }}>
      <Typography tag="h3">{title || "Exchange History"}</Typography>
      <div style={{ overflowX: "auto" }}>
        <Transactions>
          <thead>
            <tr>
              {HEADER.map((name: string, index: number) => (
                <th key={`transaction_th_${index}`}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, index) => {
              const date = dayjs(
                getDateTimestamp(row.timestamp.toString())
              ).format(`YY.MM.DD, HH:mm`);

              return (
                <tr key={`transaction_tr_${index}`}>
                  <td>{row.event}</td>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.price ? `${row.price} ${row.currency}` : "-"}</td>
                  <td>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </Transactions>
      </div>
    </div>
  );
}
