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
  const {
    withExternalConnectionProps,
    externalConnectedChainId,
    withMagicLink
  } = useConfigContext();
  const externalSigner = useExternalSigner();
  const { data: externalSignerChainId } = useExternalSignerChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  let magicChainId: number | undefined;
  let magicError: unknown;
  try {
    magicChainId = useMagicChainId();
  } catch (error) {
    magicError = error; // error if the provider is not there
  }
  if (!withExternalConnectionProps && magicError && withMagicLink) {
    throw magicError;
  }
  if (externalConnectedChainId) {
    return externalConnectedChainId;
  }
  if (externalSigner) {
    return externalSignerChainId;
  }
  if (isMagicLoggedIn && withMagicLink) {
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
  const { withExternalConnectionProps, withWeb3React, withMagicLink } =
    useConfigContext();
  const { provider: web3Provider } = useWeb3ReactWrapper() || {};
  let magicProvider;
  let error: unknown;
  if (!withExternalConnectionProps && error && !withWeb3React) {
    throw error;
  }
  try {
    magicProvider = useMagicProvider();
  } catch (magicError) {
    error = magicError; // error if the provider is not there
  }
  if (!withExternalConnectionProps && error && withMagicLink) {
    throw error;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const magicLinkProvider = magicProvider!; // it should always be not null at this point
  const isMagicLoggedIn = useIsMagicLoggedIn();
  return isMagicLoggedIn
    ? magicLinkProvider ?? web3Provider
    : withWeb3React
      ? web3Provider ?? magicLinkProvider
      : magicLinkProvider ?? web3Provider;
}

export function useSigner(): Signer | undefined {
  const {
    withExternalConnectionProps,
    externalConnectedSigner,
    withMagicLink
  } = useConfigContext();
  let magicProvider: providers.Web3Provider | undefined, magicError: unknown;

  try {
    magicProvider = useMagicProvider();
  } catch (err) {
    magicError = err; // error if the provider is not there
  }
  const { externalSigner } = useExternalSigner() ?? {};
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
  if (!withExternalConnectionProps && magicError && withMagicLink) {
    throw magicError;
  }
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
