import { useCallback } from "react";
import { useDisconnect as useDisconnectWagmi } from "wagmi";
import { useUser } from "../../components/magicLink/UserContext";
import { useIsMagicLoggedIn, useMagic, useWalletInfo } from "../magic";
import { getMagicLogout } from "../../lib/magicLink/logout";

export const useDisconnect = () => {
  const { setUser } = useUser();
  const magic = useMagic();
  const { remove } = useWalletInfo();
  const magicLogout = getMagicLogout(magic);
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const { disconnectAsync, status } = useDisconnectWagmi();
  const disconnect = useCallback(() => {
    if (disconnectAsync && status !== "loading") {
      disconnectAsync();
    }
  }, [disconnectAsync, status]);


  return useCallback(async () => {
    remove();
    if (isMagicLoggedIn) {
      await magicLogout(setUser);
    } else {
      await disconnect();
    }
  }, [magicLogout, remove, setUser, isMagicLoggedIn, disconnect]);
};
