import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { ArrowSquareOut } from "phosphor-react";
import React, { useMemo } from "react";
import { Exchange } from "../../../../types/exchange";
import { useEnvContext } from "../../../environment/EnvironmentContext";

import { getExchangeTokenId } from "../../../../lib/utils/exchange";
import { OpenSeaButton } from "./detail/Detail.style";
import { getOpenSeaUrl } from "../../../../lib/opensea/getOpenSeaUrl";

interface Props {
  exchange?: Exchange;
}

export default function DetailOpenSea({ exchange }: Props) {
  const { envName, configId } = useEnvContext();
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(
        exchange as unknown as subgraph.ExchangeFieldsFragment
      )
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const openSeaUrl = useMemo(() => {
    return getOpenSeaUrl({
      exchange,
      envName,
      configId
    });
  }, [exchange, envName, configId]);

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
