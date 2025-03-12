import { ConfigId, EnvironmentType } from "@bosonprotocol/core-sdk";
import { Exchange } from "../../types/exchange";
import { getExchangeTokenId } from "../utils/exchange";

const openSeaUrlMap = new Map([
  [
    "testing", // testnets
    new Map([
      [
        "testing-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}` // TO BE CONFIRMED
      ],
      [
        "testing-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
      ],
      [
        "testing-84532-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/base_sepolia/${contractAddress}/${tokenId}`
      ],
      [
        "testing-11155420-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/optimism_sepolia/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "staging", // testnets
    new Map([
      [
        "staging-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}` // TO BE CONFIRMED
      ],
      [
        "staging-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
      ],
      [
        "staging-84532-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/base_sepolia/${contractAddress}/${tokenId}`
      ],
      [
        "staging-11155420-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/optimism_sepolia/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "production", // Polygon
    new Map([
      [
        "production-137-0",
        (tokenId: string, contractAddress: string) =>
          `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
      ],
      [
        "production-1-0",
        (tokenId: string, contractAddress: string) =>
          `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`
      ],
      [
        "production-8453-0",
        (tokenId: string, contractAddress: string) =>
          `https://opensea.io/assets/base/${contractAddress}/${tokenId}`
      ]
    ])
  ]
]);

export const getOpenSeaUrl = ({
  configId,
  envName,
  exchange
}: {
  envName: EnvironmentType;
  configId: ConfigId;
  exchange: Exchange | undefined;
}): string => {
  if (!exchange) {
    return "";
  }
  const tokenId = getExchangeTokenId(exchange, envName);
  const urlFn = openSeaUrlMap.get(envName)?.get(configId);

  return urlFn?.(tokenId, exchange.seller.voucherCloneAddress) || "";
};
