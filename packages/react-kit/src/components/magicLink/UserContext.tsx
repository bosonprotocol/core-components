import React, { useContext } from "react";
import { useConfigContext } from "../config/ConfigContext";

export const UserContext = React.createContext<{
  user: string | undefined;
  setUser: React.Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);
const emptyUserContext = {
  user: "",
  setUser: () => {
    //
  }
};
export const useUser = () => {
  const { withMagicLink } = useConfigContext();
  const value = useContext(UserContext);
  if (!value && withMagicLink) {
    throw new Error(`useUser must be used under a UserProvider`);
  }
  return value || emptyUserContext;
};
