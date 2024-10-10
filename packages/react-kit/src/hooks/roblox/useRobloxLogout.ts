import { useMutation, useQueryClient } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";
import { robloxQueryKeys } from "./const";

type UseIsRobloxLoggedInProps = {
  origin: string;
};
export const useRobloxLogout = ({ origin }: UseIsRobloxLoggedInProps) => {
  const [, , removeFromStorage] = useRobloxLocalStorage();
  const queryClient = useQueryClient();

  return useMutation(
    [robloxQueryKeys.logout, origin],
    async () => {
      const response = await fetch(`${origin}/logout`, {
        method: "POST",
        credentials: "include"
      });
      if (response.ok) {
        removeFromStorage();
        queryClient.resetQueries(robloxQueryKeys.loggedIn);
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
