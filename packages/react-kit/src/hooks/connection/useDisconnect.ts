import { useUser } from "components/magicLink/UserContext";
import { useMagic, useWalletInfo } from "hooks/magic";
import { getMagicLogout } from "lib/magicLink/logout";
import { useCallback } from "react";
import { disconnect } from "@wagmi/core";

export const useDisconnect = () => {
  const { setUser } = useUser();
  const magic = useMagic();
  const { remove } = useWalletInfo();
  const magicLogout = getMagicLogout(magic);

  return useCallback(async () => {
    remove();
    await disconnect();
    await magicLogout(setUser);
  }, [magicLogout, remove, setUser]);
};
