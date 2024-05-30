import { useCallback } from "react";
import { useDisconnect as useDisconnectWagmi } from "wagmi";
import { useUser } from "../../components/magicLink/UserContext";
import { useIsMagicLoggedIn, useMagic, useWalletInfo } from "../magic";
import { getMagicLogout } from "../../lib/magicLink/logout";
import { useAppDispatch } from "../../state/hooks";
import { updateSelectedWallet } from "../../state/user/reducer";
import { useWeb3ReactWrapper } from "../web3React/useWeb3ReactWrapper";

type DisconnectProps =
  | {
      isUserDisconnecting: true;
      onUserDisconnect?: () => unknown;
    }
  | {
      isUserDisconnecting?: false;
      onUserDisconnect?: undefined;
    };
export const useDisconnect = () => {
  const { connector } = useWeb3ReactWrapper() || {};
  const { setUser } = useUser();
  const magic = useMagic();
  const { remove } = useWalletInfo();
  const magicLogout = getMagicLogout(magic);
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const dispatch = useAppDispatch();
  const { disconnectAsync, status } = useDisconnectWagmi();
  const disconnect = useCallback(() => {
    if (disconnectAsync && status !== "loading") {
      disconnectAsync();
    }
  }, [disconnectAsync, status]);

  return useCallback(
    async ({ isUserDisconnecting, onUserDisconnect }: DisconnectProps) => {
      if (connector) {
        if (connector.deactivate) {
          await connector.deactivate();
        }
        await connector.resetState();
      }

      remove();
      if (isUserDisconnecting) {
        onUserDisconnect?.(); // TODO: cleanLocalStorage();
      }
      dispatch(updateSelectedWallet({ wallet: undefined }));
      if (isMagicLoggedIn) {
        await magicLogout(setUser);
      } else {
        await disconnect();
      }
    },
    [
      magicLogout,
      remove,
      setUser,
      isMagicLoggedIn,
      disconnect,
      connector,
      dispatch
    ]
  );
};
