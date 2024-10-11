/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useMemo } from "react";
import { useUser } from "../../components/magicLink/UserContext";
import {
  useIsMagicLoggedIn,
  useMagicChainId,
  useMagicProvider
} from "../magic";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useExternalSigner } from "../../components/signer/useExternalSigner";
import { useSignerAddress } from "../useSignerAddress";
import { useQuery } from "react-query";
import { useExternalSignerChainId } from "../../lib/signer/externalSigner";
import { Signer, providers } from "ethers";
import { useWeb3ReactWrapper } from "../web3React/useWeb3ReactWrapper";

export function useAccount() {
  const { account: web3ReactAccount } = useWeb3ReactWrapper() || {};
  const { externalConnectedAccount } = useConfigContext();

  const { user } = useUser();
  const { externalWeb3LibAdapter } = useExternalSigner() ?? {};
  const { signerAddress: externalSignerAddress } = useSignerAddress(
    externalWeb3LibAdapter
  );
  const account = useMemo(
    () => ({
      address:
        externalConnectedAccount ??
        externalSignerAddress ??
        web3ReactAccount ??
        user
    }),
    [user, web3ReactAccount, externalSignerAddress, externalConnectedAccount]
  );
  return account;
}

export function useChainId(): number | undefined {
  const { chainId: web3ReactChainId } = useWeb3ReactWrapper() || {};
  const { externalConnectedChainId } = useConfigContext();
  const externalSigner = useExternalSigner();
  const { data: externalSignerChainId } = useExternalSignerChainId();
  const magicChainId = useMagicChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  if (externalConnectedChainId) {
    return externalConnectedChainId;
  }
  if (externalSigner) {
    return externalSignerChainId;
  }
  if (isMagicLoggedIn) {
    return magicChainId;
  }
  return web3ReactChainId;
}

export function useIsConnectedToWrongChain(): boolean {
  const { config } = useConfigContext();
  const chainId = useChainId();
  const connectedToWrongChain = config.chainId !== chainId;
  return connectedToWrongChain;
}

export function useProvider():
  | providers.JsonRpcProvider
  | providers.FallbackProvider {
  const { withWeb3React } = useConfigContext();
  const { provider: web3Provider } = useWeb3ReactWrapper() || {};

  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  return isMagicLoggedIn
    ? magicProvider ?? web3Provider
    : withWeb3React
      ? web3Provider ?? magicProvider
      : magicProvider ?? web3Provider;
}

export function useSigner(): Signer | undefined {
  const { externalConnectedSigner } = useConfigContext();
  const { externalSigner } = useExternalSigner() ?? {};
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const { provider: web3Provider } = useWeb3ReactWrapper() || {};

  const signer = useMemo(() => {
    return externalConnectedSigner
      ? externalConnectedSigner
      : externalSigner
        ? externalSigner
        : isMagicLoggedIn
          ? magicProvider?.getSigner()
          : web3Provider?.getSigner();
  }, [
    externalConnectedSigner,
    externalSigner,
    magicProvider,
    isMagicLoggedIn,
    web3Provider
  ]);
  return signer;
}

export function useBalance(
  blockTag: Parameters<
    NonNullable<ReturnType<typeof useSigner>>["getBalance"]
  >[0],
  options: { enabled: boolean } = { enabled: false }
) {
  const signer = useSigner();
  return useQuery(
    ["balance", blockTag, !!signer],
    () => signer?.getBalance(blockTag),
    {
      enabled: options.enabled
    }
  );
}
