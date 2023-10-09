/* eslint-disable react-hooks/rules-of-hooks */
// source: https://wagmi.sh/react/ethers-adapters

import { useUser } from "components/magicLink/UserContext";
import { useMagicChainId } from "hooks/magic";
import { useMemo } from "react";
import { useNetwork, useAccount as useWagmiAccount } from "wagmi";

export function useAccount() {
  const { address: account } = useWagmiAccount();
  const { user } = useUser();
  return useMemo(() => ({ address: account ?? user }), [account, user]);
}

export function useChainId() {
  const { chain } = useNetwork();
  const magicChainId = useMagicChainId();
  const chainIdToReturn = magicChainId ?? chain?.id;
  return chainIdToReturn;
}
