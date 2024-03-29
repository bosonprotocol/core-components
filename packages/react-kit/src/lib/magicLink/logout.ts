import { Magic } from "magic-sdk";

// When a user logs out, disconnect with Magic & re-set web3 provider
export const getMagicLogout =
  (magic: Magic | undefined | null) =>
  async (setUser: (user: string | undefined) => unknown) => {
    if (!magic) {
      return;
    }
    localStorage.removeItem("user");
    setUser(undefined);
    await magic.wallet.disconnect();
  };
