import { useLocalStorage } from "../storage/useLocalStorage";
import { GetLoggedInResponse } from "../../lib/roblox/types";
import { robloxLocalStorageKey } from "./const";

export const useRobloxLocalStorage = () => {
  return useLocalStorage<typeof robloxLocalStorageKey, GetLoggedInResponse>(
    robloxLocalStorageKey,
    {
      isLoggedIn: false,
      claims: {
        sub: "",
        name: ""
      },
      nonce: ""
    }
  );
};
