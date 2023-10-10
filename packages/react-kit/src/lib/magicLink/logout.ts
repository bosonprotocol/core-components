import { Magic } from "magic-sdk";
import { SetUser } from "../../components/magicLink/UserContext";

// When a user logs out, disconnect with Magic & re-set web3 provider
export const getMagicLogout =
  (magic: Magic | undefined | null) => async (setUser: SetUser) => {
    if (!magic) {
      return;
    }
    localStorage.removeItem("user");
    setUser(undefined);
    await magic.wallet.disconnect();
  };
