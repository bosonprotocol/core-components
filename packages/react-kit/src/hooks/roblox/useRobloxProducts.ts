import { useInfiniteQuery, useQueryClient } from "react-query";
import { GetProductsResponse } from "@bosonprotocol/roblox-sdk";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";

type UseRobloxProductsProps = {
  sellerId: string;
  pageSize: number;
  options: { enabled?: boolean };
};
export const useRobloxProducts = ({
  sellerId,
  pageSize,
  options = {}
}: UseRobloxProductsProps) => {
  const queryClient = useQueryClient();
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = mutationKeys.getProducts({
    backendOrigin,
    sellerId,
    pageSize
  });
  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = 0 }) => {
      const response = await fetch(
        `${backendOrigin}/products?bosonSellerId=${sellerId}&first=${pageSize}&skip=${pageParam}`,
        { credentials: "include" } // required to include Cookie in the request
      );
      if (!response.ok) {
        throw new Error(
          `Error while fetching roblox products, status = ${response.status.toString()}`
        );
      }
      const data = (await response.json()) as GetProductsResponse;
      if (data.some((product) => product.availability.status === "PENDING")) {
        console.log(
          "Some products are in PENDING state. Refresh products in a short while..."
        );
        // Wait a short delay and refresh products
        setTimeout(() => queryClient.invalidateQueries(queryKey), 1000);
      }
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
