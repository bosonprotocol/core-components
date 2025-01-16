import { useInfiniteQuery } from "react-query";
import { GetExchangesResponse } from "@bosonprotocol/roblox-sdk";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";

type UseRobloxProductsProps = {
  sellerId: string;
  userWallet: string;
  pageSize: number;
  options: {
    enabled?: boolean;
  };
};
export const useRobloxExchanges = ({
  sellerId,
  userWallet,
  pageSize,
  options
}: UseRobloxProductsProps) => {
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = mutationKeys.getExchanges({
    backendOrigin,
    pageSize,
    sellerId,
    userWallet
  });
  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = 0 }) => {
      const response = await fetch(
        `${backendOrigin}/exchanges?bosonSellerId=${sellerId}&userWallet=${userWallet}&first=${pageSize}&skip=${pageParam}`
      );
      if (!response.ok) {
        throw new Error(
          `Error while fetching roblox exchanges, status = ${response.status.toString()}`
        );
      }
      const data = (await response.json()) as GetExchangesResponse;
      return data;
    },
    {
      ...options,
      getNextPageParam: (lastPage, pages) => {
        const result = lastPage.length === pageSize ? pages.length : undefined;
        return result;
      }
    }
  );
};
