import { subgraph } from "@bosonprotocol/react-kit";
import { BigNumber, ethers } from "ethers";

import { useAccount, useBalance, useChainId } from "../connection/connection";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useErc20Balance } from "../contracts";

export function useExchangeTokenBalance(
  exchangeToken: Pick<
    subgraph.OfferFieldsFragment["exchangeToken"],
    "address" | "decimals"
  >,
  { enabled }: { enabled: boolean } = {
    enabled: true
  }
) {
  const chainId = useChainId();
  const { config } = useConfigContext();
  const chainIdToUse = chainId ?? config.chainId;
  const { address } = useAccount();

  const isNativeCoin = exchangeToken.address === ethers.constants.AddressZero;

  const { data: erc20Balance, isLoading: erc20Loading } = useErc20Balance(
    {
      contractAddress: exchangeToken.address,
      owner: address
    },
    {
      enabled: !isNativeCoin && !!chainIdToUse && enabled
    }
  );
  const { data: nativeBalances, isLoading: nativeLoading } = useBalance(
    address ? [address] : [""],
    { enabled: isNativeCoin && !!chainIdToUse && enabled }
  );

  return {
    balance: isNativeCoin
      ? nativeBalances
      : erc20Balance
      ? BigNumber.from(erc20Balance)
      : undefined,
    loading: erc20Loading || nativeLoading
  };
}
