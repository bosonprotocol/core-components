import { useLocalStorage } from "../storage/useLocalStorage";
import { RobloxLoggedIn, robloxLocalStorageKey } from "./const";

export const useRobloxLocalStorage = () => {
  return useLocalStorage<typeof robloxLocalStorageKey, RobloxLoggedIn>(
    robloxLocalStorageKey,
    {
      isLoggedIn: false,
      claims: {
        nickname: ""
      }
    }
  );
};
