import { useQuery, useQueryClient } from "react-query";
import { GetProductsResponse } from "./backend.types";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";

type UseRobloxProductsProps = {
  sellerId: string;
};
export const useRobloxProducts = ({ sellerId }: UseRobloxProductsProps) => {
  const queryClient = useQueryClient();
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = ["roblox-products", backendOrigin, sellerId];
  return useQuery(queryKey, async () => {
    const response = await fetch(
      `${backendOrigin}/products?bosonSellerId=${sellerId}`,
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
  });
};
