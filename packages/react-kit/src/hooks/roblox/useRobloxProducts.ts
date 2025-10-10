import { useInfiniteQuery, useQueryClient } from "react-query";
import {
  GetProductsResponse,
  ProductAvailabilityStatus
} from "../../lib/roblox/types";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";
import { mutationKeys } from "./mutationKeys";

type UseRobloxProductsProps = {
  sellerId: string;
  pageSize: number;
  statuses:
    | ProductAvailabilityStatus["status"][]
    | Readonly<ProductAvailabilityStatus["status"][]>;
  options: { enabled?: boolean };
};
export const useRobloxProducts = ({
  sellerId,
  pageSize,
  statuses,
  options = {}
}: UseRobloxProductsProps) => {
  const queryClient = useQueryClient();
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = mutationKeys.getProducts({
    backendOrigin,
    sellerId,
    pageSize,
    statuses
  });
  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = 0 }) => {
      const response = await fetch(
        `${backendOrigin}/products?${new URLSearchParams({ bosonSellerId: sellerId, first: pageSize.toString(), skip: (pageParam * pageSize).toString(), only: statuses.join(",") }).toString()}`,
        { credentials: "include" } // required to include Cookie in the request
      );
      if (!response.ok) {
        throw new Error(
          `Error while fetching roblox products, status = ${response.status.toString()}`
        );
      }
      const data = (await response.json()) as GetProductsResponse;
      if (
        data.products.some(
          (product) => product.availability.status === "PENDING"
        )
      ) {
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
      getNextPageParam: ({ hasMore }, pages) => {
        const result = hasMore ? pages.length : undefined;
        return result;
      }
    }
  );
};
