import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { ArrowSquareOut } from "phosphor-react";
import React, { useMemo } from "react";
import { Exchange } from "../../../../../../types/exchange";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";

import { OpenSeaButton } from "./Detail.style";
import { getExchangeTokenId } from "../../../../../../lib/utils/exchange";

interface Props {
  exchange?: Exchange;
}

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    (tokenId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
  ],
  [
    "staging", // Mumbai
    (tokenId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
  ],
  [
    "production", // Polygon
    (tokenId: string, contractAddress: string) =>
      `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
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

    const tokenId = getExchangeTokenId(exchange, envName);

    return urlFn?.(tokenId, exchange.seller.voucherCloneAddress) || "";
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
