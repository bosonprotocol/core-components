import React, { useContext } from "react";

export const UserContext = React.createContext<{
  user: string | undefined;
  setUser: React.Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

export const useUser = () => {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error(`useUser must be used under a UserProvider`);
  }
  return value;
};
