import { useContext } from "react";
import { RobloxContext } from "./RobloxContext";

export const useRobloxConfigContext = () => {
  const context = useContext(RobloxContext);
  if (!context)
    throw new Error(
      "useRobloxConfigContext must be used within a RobloxProvider"
    );
  return context;
};
