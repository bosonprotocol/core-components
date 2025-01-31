import { useMutation, useQueryClient } from "react-query";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";
import { productsPageSize } from "../../components/widgets/roblox/components/const";

type UsePostRobloxWalletAuthProps = {
  sellerId: string;
  address: string;
  signature: string;
};
export const usePostRobloxWalletAuth = () => {
  const { backendOrigin } = useRobloxConfigContext();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ sellerId, address, signature }: UsePostRobloxWalletAuthProps) => {
      const response = await fetch(`${backendOrigin}/wallet-auth`, {
        method: "POST",
        credentials: "include", // required to include Cookie in the request
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address,
          signature,
          sellerId: sellerId.toString()
        })
      });
      if (!response.ok) {
        throw new Error(
          `Error while calling POST /wallet-auth, status = ${response.status.toString()}`
        );
      }
      return;
    },
    {
      onSettled: (data, error, variables) => {
        if (data) {
          console.log("usePostRobloxWalletAuth success", data);
          // request products again
          queryClient.invalidateQueries(
            mutationKeys.getProducts({
              backendOrigin,
              sellerId: variables.sellerId,
              pageSize: productsPageSize
            })
          );
        }
        if (error) {
          console.error("usePostRobloxWalletAuth error: " + error);
        }
      }
    }
  );
};
