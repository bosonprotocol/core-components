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
import { useExternalSignerChainId } from "../../lib/signer/externalSigner";
import { Signer } from "ethers";

export function useAccount() {
  const { address: account } = useWagmiAccount();
  const { user } = useUser();
  const { externalWeb3LibAdapter } = useExternalSigner() ?? {};
  const externalSignerAddress = useSignerAddress(externalWeb3LibAdapter);
  return useMemo(
    () => ({ address: externalSignerAddress ?? account ?? user }),
    [account, user, externalSignerAddress]
  );
}

export function useChainId(): number | undefined {
  const externalSigner = useExternalSigner();
  const { data: externalSignerChainId } = useExternalSignerChainId();
  const { chain } = useNetwork();
  const magicChainId = useMagicChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const chainIdToReturn = externalSigner
    ? externalSignerChainId
    : isMagicLoggedIn
    ? magicChainId
    : chain?.id;
  return chainIdToReturn;
}

export function useIsConnectedToWrongChain(): boolean {
  const { config } = useConfigContext();
  const chainId = useChainId();
  const connectedToWrongChain = config.chainId !== chainId;
  return connectedToWrongChain;
}

export function useSigner(): Signer | undefined {
  const wagmiSigner = useEthersSigner();
  const { externalSigner } = useExternalSigner() ?? {};
  const magicProvider = useMagicProvider();
  const isMagicLoggedIn = useIsMagicLoggedIn();

  const signer = useMemo(() => {
    return externalSigner
      ? externalSigner
      : isMagicLoggedIn
      ? magicProvider?.getSigner()
      : wagmiSigner;
  }, [externalSigner, wagmiSigner, magicProvider, isMagicLoggedIn]);
  return signer;
}
