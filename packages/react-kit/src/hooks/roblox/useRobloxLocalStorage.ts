import { useLocalStorage } from "../storage/useLocalStorage";
import { GetLoggedInResponse } from "./backend.types";
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
