import { BigNumber } from "ethers";
import { Exchange } from "../../types/exchange";
import { EnvironmentType } from "@bosonprotocol/core-sdk";

const PROTOCOL_DEPLOYMENT_TIMES = {
  v221: {
    local: 0,
    testing: 0, // Freshly deployed in v2.2.1
    staging: 1683872305, // Friday, May 12, 2023 6:18:25 AM
    production: 1684495020 // Friday, May 19, 2023 11:17:00 AM
  }
};

export const getExchangeTokenId = (
  exchange: Exchange,
  envName: EnvironmentType
): string => {
  if (
    Number(exchange.committedDate) < PROTOCOL_DEPLOYMENT_TIMES.v221[envName]
  ) {
    // Before v2.2.1, tokenId = exchangeId
    return exchange.id;
  }
  // Since v2.2.1, tokenId = exchangeId | offerId << 128
  return BigNumber.from(exchange.offer.id).shl(128).add(exchange.id).toString();
};
