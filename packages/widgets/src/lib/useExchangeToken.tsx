import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

type ExchangeToken = {
  name: string;
  symbol: string;
  address: string;
  allowance: ethers.BigNumber;
  decimals: number;
};

const ETH_EXCHANGE_TOKEN: ExchangeToken = {
  name: "Ether",
  symbol: "ETH",
  address: ethers.constants.AddressZero,
  allowance: ethers.constants.MaxUint256,
  decimals: 18
};

function useReloadToken() {
  const [reloadToken, setReloadToken] = useState(0);
  const reload = () => setReloadToken((token) => token + 1);

  return { reloadToken, reload };
}

export function useExchangeToken(
  exchangeTokenAddress: string,
  coreSDK?: CoreSDK
) {
  const { reloadToken, reload } = useReloadToken();
  const isEth = exchangeTokenAddress === ethers.constants.AddressZero;

  const [tokenState, setTokenState] = useState<
    | {
        status: "loading";
      }
    | {
        status: "error";
      }
    | { status: "token"; token: ExchangeToken }
  >(
    isEth
      ? { status: "token", token: ETH_EXCHANGE_TOKEN }
      : { status: "loading" }
  );

  useEffect(() => {
    if (!coreSDK || isEth) return;

    setTokenState({ status: "loading" });

    Promise.all([
      coreSDK.getExchangeTokenAllowance(exchangeTokenAddress),
      coreSDK.getExchangeTokenInfo(exchangeTokenAddress)
    ])
      .then(([allowanceOfSigner, exchangeTokenInfo]) => {
        setTokenState({
          status: "token",
          token: {
            address: exchangeTokenAddress,
            allowance: ethers.BigNumber.from(allowanceOfSigner),
            ...exchangeTokenInfo
          }
        });
      })
      .catch(() => setTokenState({ status: "error" }));
  }, [coreSDK, exchangeTokenAddress, isEth, reloadToken]);

  return { reload, tokenState };
}
