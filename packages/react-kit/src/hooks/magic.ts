import { useContext } from "react";
import { useQuery } from "react-query";
import { MagicContext } from "../components/magicLink/MagicContext";
import { useUser } from "../components/magicLink/UserContext";

export const useMagic = () => {
  const context = useContext(MagicContext);
  if (!context) {
    throw new Error("useMagic must be used within MagicContext");
  }
  return context.magic;
};

export const useWalletInfo = () => {
  const magic = useMagic();
  return useQuery(["wallet-info", magic?.uuid], async () => {
    if (!magic) {
      return;
    }
    const walletInfo = await magic.wallet.getInfo();
    return walletInfo;
  });
};

export function useMagicProvider() {
  const context = useContext(MagicContext);
  if (!context) {
    throw new Error("useMagic must be used within MagicContext");
  }
  return context.magicProvider;
}

export function useMagicChainId() {
  const magicProvider = useMagicProvider();
  return magicProvider?._network?.chainId;
}

export function useIsMagicLoggedIn() {
  const { user } = useUser();
  const isMagicLoggedIn = !!user;
  return isMagicLoggedIn;
}
