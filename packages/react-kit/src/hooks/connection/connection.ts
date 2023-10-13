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

export function useAccount() {
  const { address: account } = useWagmiAccount();
  const { user } = useUser();
  return useMemo(() => ({ address: account ?? user }), [account, user]);
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

export function useSigner() {
  const wagmiSigner = useEthersSigner();
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  const signer = useMemo(() => {
    return isMagicLoggedIn ? magicProvider?.getSigner() : wagmiSigner;
  }, [wagmiSigner, magicProvider, isMagicLoggedIn]);
  return signer;
}
