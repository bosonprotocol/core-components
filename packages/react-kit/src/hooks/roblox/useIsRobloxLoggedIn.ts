import { useQuery, useQueryClient } from "react-query";
import { useRobloxLocalStorage } from "./useRobloxLocalStorage";
import { robloxQueryKeys } from "./const";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";
import { GetLoggedInResponse } from "../../lib/roblox/types";
import { productsPageSize } from "../../components/widgets/roblox/components/const";

type UseIsRobloxLoggedInProps = {
  sellerId: string;
  options?: {
    enabled?: boolean;
    onSuccess?: ((data: GetLoggedInResponse | null) => void) | undefined;
  };
};
export const useIsRobloxLoggedIn = ({
  sellerId,
  options
}: UseIsRobloxLoggedInProps) => {
  const [storedValue, setValue] = useRobloxLocalStorage();
  const { backendOrigin } = useRobloxConfigContext();
  const queryClient = useQueryClient();
  return useQuery(
    robloxQueryKeys.loggedIn(backendOrigin),
    async () => {
      const response = await fetch(`${backendOrigin}/logged-in`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const data = (await response.json()) as GetLoggedInResponse;
        setValue(data);
        return data;
      }
      return null;
    },
    {
      ...options,
      initialData: storedValue,
      onError: (error) => {
        console.error("Error on /logged-in call:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          mutationKeys.getProducts({
            backendOrigin,
            sellerId,
            pageSize: productsPageSize
          }),
          { exact: false }
        );
      }
    }
  );
};
