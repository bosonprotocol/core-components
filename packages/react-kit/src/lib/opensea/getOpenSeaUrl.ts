import { ConfigId, EnvironmentType } from "@bosonprotocol/core-sdk";
import { Exchange } from "../../types/exchange";
import { getExchangeTokenId } from "../utils/exchange";

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    new Map([
      [
        "testing-80001-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
      ],
      [
        "testing-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}` // TO BE CONFIRMED
      ],
      [
        "testing-5-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
      ],
      [
        "testing-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "staging", // Mumbai
    new Map([
      [
        "staging-80001-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
      ],
      [
        "staging-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}` // TO BE CONFIRMED
      ],
      [
        "staging-5-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
      ],
      [
        "staging-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
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
