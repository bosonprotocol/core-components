import { useCallback } from "react";
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
      }
    },
    [magicLogout, remove, setUser, isMagicLoggedIn, connector, dispatch]
  );
};
