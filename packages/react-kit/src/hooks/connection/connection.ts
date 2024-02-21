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
import { Signer } from "ethers";

export function useAccount() {
  let wagmiAccount: `0x${string}` | undefined, error: unknown;
  const { withExternalConnectionProps, externalConnectedAccount } =
    useConfigContext();
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
        user
    }),
    [wagmiAccount, user, externalSignerAddress, externalConnectedAccount]
  );
  if (!withExternalConnectionProps && error) {
    throw error;
  }
  return account;
}

export function useChainId(): number | undefined {
  const { withExternalConnectionProps, externalConnectedChainId } =
    useConfigContext();
  const externalSigner = useExternalSigner();
  const { data: externalSignerChainId } = useExternalSignerChainId();
  const magicChainId = useMagicChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  let networkChainId: number | undefined;
  let error: unknown;
  try {
    networkChainId = useNetwork().chain?.id;
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
  if (externalConnectedChainId) {
    return externalConnectedChainId;
  }
  if (externalSigner) {
    return externalSignerChainId;
  }
  if (isMagicLoggedIn) {
    return magicChainId;
  }
  if (!withExternalConnectionProps && error) {
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

export function useProvider() {
  const { withExternalConnectionProps } = useConfigContext();
  let provider;
  let error: unknown;
  try {
    provider = useEthersProvider();
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  if (!withExternalConnectionProps && error) {
    throw error;
  }
  return isMagicLoggedIn
    ? magicProvider ?? provider
    : provider ?? magicProvider;
}

export function useSigner(): Signer | undefined {
  const { withExternalConnectionProps, externalConnectedSigner } =
    useConfigContext();
  let wagmiSigner: ReturnType<typeof useEthersSigner>, error: unknown;
  try {
    const ethersSigner = useEthersSigner();
    wagmiSigner = ethersSigner;
  } catch (wagmiError) {
    error = wagmiError; // error if the provider is not there
  }
  const { externalSigner } = useExternalSigner() ?? {};
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  const signer = useMemo(() => {
    return externalConnectedSigner
      ? externalConnectedSigner
      : externalSigner
      ? externalSigner
      : isMagicLoggedIn
      ? magicProvider?.getSigner()
      : wagmiSigner;
  }, [
    externalConnectedSigner,
    externalSigner,
    wagmiSigner,
    magicProvider,
    isMagicLoggedIn
  ]);
  if (!withExternalConnectionProps && error) {
    throw error;
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
