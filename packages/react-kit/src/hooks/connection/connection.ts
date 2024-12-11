/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useMemo } from "react";
import { useNetwork, useAccount as useWagmiAccount } from "wagmi";
import { useUser } from "../../components/magicLink/UserContext";
import {
  useIsMagicLoggedIn,
  useMagicChainId,
  useMagicProvider
} from "../magic";
import { useEthersSigner } from "../ethers/useEthersSigner";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useExternalSigner } from "../../components/signer/useExternalSigner";
import { useSignerAddress } from "../useSignerAddress";
import { useEthersProvider } from "../ethers/useEthersProvider";
import { useQuery } from "react-query";
import { useExternalSignerChainId } from "../../lib/signer/externalSigner";
import { Signer, providers } from "ethers";
import { useWeb3ReactWrapper } from "../web3React/useWeb3ReactWrapper";

export function useAccount() {
  let wagmiAccount: `0x${string}` | undefined, error: unknown;
  const { account: web3ReactAccount } = useWeb3ReactWrapper() || {};
  const {
    withExternalConnectionProps,
    externalConnectedAccount,
    withWeb3React
  } = useConfigContext();
  try {
    const { address: account } = useWagmiAccount();
    wagmiAccount = account;
  } catch (err) {
    error = err;
  }

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
        wagmiAccount ??
        web3ReactAccount ??
        user
    }),
    [
      wagmiAccount,
      user,
      web3ReactAccount,
      externalSignerAddress,
      externalConnectedAccount
    ]
  );
  if (!withExternalConnectionProps && error && !withWeb3React) {
    throw error;
  }
  return account;
}

export function useChainId(): number | undefined {
  const { chainId: web3ReactChainId } = useWeb3ReactWrapper() || {};
  const {
    withExternalConnectionProps,
    externalConnectedChainId,
    withWeb3React,
    withMagicLink
  } = useConfigContext();
  const externalSigner = useExternalSigner();
  const { data: externalSignerChainId } = useExternalSignerChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  let networkChainId: number | undefined;
  let magicChainId: number | undefined;
  let error: unknown;
  let magicError: unknown;
  try {
    networkChainId = useNetwork().chain?.id;
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
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
  if (web3ReactChainId) {
    return web3ReactChainId;
  }
  if (!withExternalConnectionProps && error && !withWeb3React) {
    throw error;
  }
  return networkChainId;
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
  let provider, magicProvider;
  let error: unknown;
  try {
    provider = useEthersProvider();
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
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
    ? magicLinkProvider ?? web3Provider ?? provider
    : withWeb3React
      ? web3Provider ?? magicLinkProvider ?? provider
      : provider ?? magicLinkProvider ?? web3Provider;
}

export function useSigner(): Signer | undefined {
  const {
    withExternalConnectionProps,
    externalConnectedSigner,
    withWeb3React,
    withMagicLink
  } = useConfigContext();
  let wagmiSigner: ReturnType<typeof useEthersSigner>, error: unknown;
  try {
    const ethersSigner = useEthersSigner();
    wagmiSigner = ethersSigner;
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
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
          : withWeb3React
            ? web3Provider?.getSigner()
            : wagmiSigner;
  }, [
    externalConnectedSigner,
    externalSigner,
    wagmiSigner,
    magicProvider,
    isMagicLoggedIn,
    web3Provider,
    withWeb3React
  ]);
  if (!withExternalConnectionProps && error && !withWeb3React) {
    throw error;
  }
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
