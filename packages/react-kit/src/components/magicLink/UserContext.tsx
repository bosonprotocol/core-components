import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useMagic } from "../../hooks";
import { getMagicLogout } from "../../lib/magicLink/logout";
import { getProvider } from "../../lib/magicLink/provider";

export type SetUser = React.Dispatch<React.SetStateAction<string | undefined>>;
export const UserContext = React.createContext<{
  user: string | undefined;
  setUser: React.Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

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

export const useUser = () => {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error(`useUser must be used under a UserProvider`);
  }
  return value;
};