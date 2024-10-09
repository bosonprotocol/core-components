import { useQuery } from "react-query";
import * as Yup from "yup";
import { useLocalStorage } from "../storage/useLocalStorage";
import { RobloxLoggedIn, robloxLocalStorageKey } from "./const";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";

const loggedPayloadSchema = Yup.object({
  isLoggedIn: Yup.boolean().required(),
  claims: Yup.object({
    nickname: Yup.string().required()
  })
});

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
    ["roblox-logged-in", origin],
    async () => {
      const response = await fetch(`${origin}/logged-in`, {
        method: "GET",
        credentials: "include"
      });
      if (response && response.ok) {
        const data = await response.json();
        const validatedData = await loggedPayloadSchema.validate(data);
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
