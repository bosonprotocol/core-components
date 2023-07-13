import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { ArrowSquareOut } from "phosphor-react";
import React, { useMemo } from "react";
import { Exchange } from "../../../../../../types/exchange";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";

import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: Exchange;
}

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    (exchangeId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${exchangeId}`
  ],
  [
    "staging", // Mumbai
    (exchangeId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${exchangeId}`
  ],
  [
    "production", // Polygon
    (exchangeId: string, contractAddress: string) =>
      `https://opensea.io/assets/matic/${contractAddress}/${exchangeId}`
  ]
]);

export default function DetailOpenSea({ exchange }: Props) {
  const { envName } = useEnvContext();
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(
        exchange as unknown as subgraph.ExchangeFieldsFragment
      )
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const openSeaUrl = useMemo(() => {
    if (!exchange) {
      return "";
    }

    const urlFn = openSeaUrlMap.get(envName);

    return urlFn?.(exchange.id, exchange.seller.voucherCloneAddress) || "";
  }, [exchange, envName]);

  if (!isToRedeem) {
    return null;
  }

  return (
    <OpenSeaButton href={openSeaUrl} $disabled={!openSeaUrl} target="_blank">
      View on OpenSea
      <ArrowSquareOut size={18} />
    </OpenSeaButton>
  );
}
