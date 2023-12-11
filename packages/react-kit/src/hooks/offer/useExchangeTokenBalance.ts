import { subgraph } from "@bosonprotocol/core-sdk";
import { BigNumber, ethers } from "ethers";

import {
  useAccount,
  useBalance,
  useChainId,
  useSigner
} from "../connection/connection";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useErc20Balance } from "../contracts";

export function useExchangeTokenBalance(
  exchangeToken: Pick<
    subgraph.OfferFieldsFragment["exchangeToken"],
    "address" | "decimals"
  >,
  { enabled }: { enabled: boolean }
) {
  const chainId = useChainId();
  const { config } = useConfigContext();
  const chainIdToUse = chainId ?? config.chainId;
  const { address } = useAccount();

  const isNativeCoin = exchangeToken.address === ethers.constants.AddressZero;
  const isErc20Enabled = !isNativeCoin && !!chainIdToUse;
  const {
    data: erc20Balance,
    isLoading: erc20Loading,
    refetch: refetchErc20
  } = useErc20Balance(
    {
      contractAddress: exchangeToken.address,
      owner: address
    },
    {
      enabled: isErc20Enabled && enabled
    }
  );
  const isNativeEnabled = isNativeCoin && !!chainIdToUse;
  const {
    data: nativeBalances,
    isLoading: nativeLoading,
    refetch: refetchNative
  } = useBalance(undefined, {
    enabled: isNativeEnabled && enabled
  });
  const balance = isNativeCoin
    ? nativeBalances
    : erc20Balance
    ? BigNumber.from(erc20Balance)
    : undefined;
  return {
    balance,
    formatted: balance
      ? ethers.utils.formatUnits(balance, exchangeToken.decimals)
      : balance,
    loading: erc20Loading || nativeLoading,
    refetch: async () => {
      const refetchedBalance = await (isErc20Enabled
        ? refetchErc20()
        : isNativeEnabled
        ? refetchNative()
        : null);
      if (!refetchedBalance) {
        return null;
      }
      return BigNumber.from(refetchedBalance.data);
    }
  };
}
