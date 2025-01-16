import { useQuery, useQueryClient } from "react-query";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";
import { GetWalletAuthResponse } from "@bosonprotocol/roblox-sdk";
import { productsPageSize } from "../../components/widgets/roblox/components/const";
type UseGetRobloxWalletAuthProps = {
  sellerId: string;
  options: { enabled: boolean };
};
export const useGetRobloxWalletAuth = ({
  sellerId,
  options
}: UseGetRobloxWalletAuthProps) => {
  const { backendOrigin } = useRobloxConfigContext();
  const queryClient = useQueryClient();
  return useQuery(
    mutationKeys.getWalletAuth({ backendOrigin }),
    async () => {
      const response = await fetch(`${backendOrigin}/wallet-auth`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(
          `Error while calling GET /wallet-auth, status = ${response.status.toString()}`
        );
      }
      return (await response.json()) as GetWalletAuthResponse;
    },
    {
      ...options,
      onSettled: (data, error) => {
        if (data) {
          console.log("useGetRobloxWalletAuth success", data);
          // request products again
          queryClient.invalidateQueries(
            mutationKeys.getProducts({
              backendOrigin,
              sellerId,
              pageSize: productsPageSize
            })
          );
        }
        if (error) {
          console.error("useGetRobloxWalletAuth error: " + error);
        }
      }
    }
  );
};
