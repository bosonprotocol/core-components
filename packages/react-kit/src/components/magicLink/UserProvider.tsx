import React, { ReactNode, useEffect, useState } from "react";
import { useMagic } from "../../hooks";
import { getProvider } from "../../lib/magicLink/provider";
import { UserContext } from "./UserContext";
import { getMagicLogout } from "../../lib/magicLink/logout";

export type SetUser = React.Dispatch<React.SetStateAction<string | undefined>>;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const magic = useMagic();
  const [user, setUser] = useState<string | undefined>(
    localStorage.getItem("user") ?? undefined
  );
  const logout = getMagicLogout(magic);
  const handleUserOnPageLoad = async () => {
    const provider = await getProvider(magic);
    const accounts = await provider.request({ method: "eth_accounts" });
    // console.log("accounts", accounts);
    // If user wallet is no longer connected, logout
    if (!accounts[0] && user) {
      logout(setUser);
    }
    // Set user in localStorage, or clear localStorage if no wallet connected
    accounts[0]
      ? localStorage.setItem("user", accounts[0])
      : localStorage.removeItem("user");
    if (typeof accounts[0] === "string") {
      setUser(accounts[0]);
    }
  };

  const value = React.useMemo(
    () => ({
      user,
      setUser
    }),
    [user, setUser]
  );

  useEffect(() => {
    handleUserOnPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ ...value }}>{children}</UserContext.Provider>
  );
};
