import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { ArrowSquareOut } from "phosphor-react";
import React, { useMemo } from "react";
import { useEnvContext } from "../../../environment/EnvironmentContext";

import { OpenSeaButton } from "./detail/Detail.style";
import { getOpenSeaUrl } from "../../../../lib/opensea/getOpenSeaUrl";
import { getExchangeTokenId } from "../../../../lib/utils/exchange";

interface Props {
  exchange?: subgraph.ExchangeFieldsFragment;
}

export default function DetailOpenSea({ exchange }: Props) {
  const { envName, configId } = useEnvContext();
  const exchangeStatus = exchange ? exchanges.getExchangeState(exchange) : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.COMMITTED;

  const openSeaUrl = useMemo(() => {
    return exchange
      ? getOpenSeaUrl({
          envName,
          configId,
          tokenId: getExchangeTokenId(exchange, envName),
          contractAddress: exchange.seller.voucherCloneAddress
        })
      : "";
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
