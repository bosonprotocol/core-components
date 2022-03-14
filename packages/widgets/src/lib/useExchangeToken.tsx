import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

type ExchangeToken = {
  name: string;
  symbol: string;
  address: string;
  allowance?: ethers.BigNumber;
  decimals: number;
};

const ETH_EXCHANGE_TOKEN: ExchangeToken = {
  name: "Ether",
  symbol: "ETH",
  address: ethers.constants.AddressZero,
  decimals: 18
};

export function useExchangeToken(
  exchangeTokenAddress: string,
  coreSDK?: CoreSDK
) {
  const isEth = exchangeTokenAddress === ethers.constants.AddressZero;

  const [exchangeToken, setExchangeToken] = useState<ExchangeToken | null>(
    isEth ? ETH_EXCHANGE_TOKEN : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (coreSDK && !isEth) {
      setIsLoading(true);

      Promise.all([
        coreSDK.getExchangeTokenAllowance(exchangeTokenAddress),
        coreSDK.getExchangeTokenInfo(exchangeTokenAddress)
      ])
        .then(([allowanceOfSigner, exchangeTokenInfo]) => {
          setExchangeToken({
            address: exchangeTokenAddress,
            allowance: ethers.BigNumber.from(allowanceOfSigner),
            ...exchangeTokenInfo
          });
        })
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  }, [coreSDK, exchangeTokenAddress, isEth]);

  return {
    exchangeToken,
    isLoading,
    error
  };
}
