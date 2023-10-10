import { useCallback } from "react";
import { disconnect } from "@wagmi/core";
import { useUser } from "../../components/magicLink/UserContext";
import { useIsMagicLoggedIn, useMagic, useWalletInfo } from "../magic";
import { getMagicLogout } from "../../lib/magicLink/logout";

export const useDisconnect = () => {
  const { setUser } = useUser();
  const magic = useMagic();
  const { remove } = useWalletInfo();
  const magicLogout = getMagicLogout(magic);
  const isMagicLoggedIn = useIsMagicLoggedIn();

  return useCallback(async () => {
    remove();
    if (isMagicLoggedIn) {
      await magicLogout(setUser);
    } else {
      await disconnect();
    }
  }, [magicLogout, remove, setUser, isMagicLoggedIn]);
};
