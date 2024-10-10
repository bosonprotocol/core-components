import { useQuery } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";
import { loggedInPayloadSchema, robloxQueryKeys } from "./const";

type UseIsRobloxLoggedInProps = {
  origin: string;
  options?: {
    enabled?: boolean;
  };
};
export const useIsRobloxLoggedIn = ({
  origin,
  options
}: UseIsRobloxLoggedInProps) => {
  const [storedValue, setValue] = useRobloxLocalStorage();
  return useQuery(
    [robloxQueryKeys.loggedIn, origin],
    async () => {
      const response = await fetch(`${origin}/logged-in`, {
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
