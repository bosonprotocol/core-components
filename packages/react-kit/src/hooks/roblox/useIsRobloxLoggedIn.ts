import { useQuery } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";
import { loggedInPayloadSchema, robloxQueryKeys } from "./const";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";

type UseIsRobloxLoggedInProps = {
  options?: {
    enabled?: boolean;
  };
};
export const useIsRobloxLoggedIn = ({ options }: UseIsRobloxLoggedInProps) => {
  const [storedValue, setValue] = useRobloxLocalStorage();
  const { backendOrigin } = useRobloxConfigContext();
  return useQuery(
    robloxQueryKeys.loggedIn(backendOrigin),
    async () => {
      const response = await fetch(`${backendOrigin}/logged-in`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        const validatedData = await loggedInPayloadSchema.validate(data);
        setValue(validatedData);
        return validatedData;
      }
      return null;
    },
    {
      ...options,
      initialData: storedValue,
      onError: (error) => {
        console.error("Error on /logged-in call:", error);
      }
    }
  );
};
