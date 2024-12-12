import { useQuery } from "react-query";
import { GetExchangesResponse } from "./backend.types";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";

type UseRobloxProductsProps = {
  sellerId: string;
  userWallet: string;
  options: {
    enabled: boolean;
  };
};
export const useRobloxExchanges = ({
  sellerId,
  userWallet,
  options
}: UseRobloxProductsProps) => {
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = ["roblox-exchanges", backendOrigin, sellerId, userWallet];
  return useQuery(
    queryKey,
    async () => {
      const response = await fetch(
        `${backendOrigin}/exchanges?bosonSellerId=${sellerId}&userWallet=${userWallet}`
      );
      if (!response.ok) {
        throw new Error(
          `Error while fetching roblox exchanges, status = ${response.status.toString()}`
        );
      }
      const data = (await response.json()) as GetExchangesResponse;
      return data;
    },
    options
  );
};
