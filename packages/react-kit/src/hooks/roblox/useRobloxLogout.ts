import { useMutation } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";

type UseIsRobloxLoggedInProps = {
  origin: string;
};
export const useRobloxLogout = ({ origin }: UseIsRobloxLoggedInProps) => {
  const [, , removeFromStorage] = useRobloxLocalStorage();
  return useMutation(
    ["roblox-logout", origin],
    async () => {
      const response = await fetch(`${origin}/logout`, {
        method: "GET"
        // credentials: "include", // TODO: check comment in backend
      });
      if (response && response.ok) {
        removeFromStorage();
      }
      return null;
    },
    {
      onError: (error) => {
        console.error("Error logging out:", error);
      }
    }
  );
};
