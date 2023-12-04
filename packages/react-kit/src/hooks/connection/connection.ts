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

export function useAccount() {
  const { address: account } = useWagmiAccount();
  const { user } = useUser();
  const externalSigner = useExternalSigner();
  const externalSignerAddress = useSignerAddress(externalSigner);
  return useMemo(
    () => ({ address: externalSignerAddress ?? account ?? user }),
    [account, user, externalSignerAddress]
  );
}

export function useChainId() {
  const { chain } = useNetwork();
  const magicChainId = useMagicChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const chainIdToReturn = isMagicLoggedIn ? magicChainId : chain?.id;
  return chainIdToReturn;
}

export function useIsConnectedToWrongChain(): boolean {
  const { config } = useConfigContext();
  const chainId = useChainId();
  const connectedToWrongChain = config.chainId !== chainId;
  return connectedToWrongChain;
}

export function useProvider() {
  const provider = useEthersProvider();
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  return isMagicLoggedIn
    ? magicProvider ?? provider
    : provider ?? magicProvider;
}

export function useSigner() {
  const wagmiSigner = useEthersSigner();
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  const signer = useMemo(() => {
    return isMagicLoggedIn ? magicProvider?.getSigner() : wagmiSigner;
  }, [wagmiSigner, magicProvider, isMagicLoggedIn]);
  return signer;
}
