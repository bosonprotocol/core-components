import { useMutation, useQueryClient } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";
import { robloxQueryKeys } from "./const";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";

export const useRobloxLogout = () => {
  const [, , removeFromStorage] = useRobloxLocalStorage();
  const queryClient = useQueryClient();
  const { backendOrigin } = useRobloxConfigContext();
  return useMutation(
    robloxQueryKeys.logout(backendOrigin),
    async () => {
      const response = await fetch(`${backendOrigin}/logout`, {
        method: "POST",
        credentials: "include"
      });
      if (response.ok) {
        removeFromStorage();
        queryClient.removeQueries(robloxQueryKeys.loggedIn(backendOrigin));
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
