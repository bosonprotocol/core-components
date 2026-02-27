import {
  SearchProductsQueryQuery,
  SearchProductsQueryQueryVariables
} from "../subgraph";
import { getSubgraphSdk } from "../utils/graphql";

export async function searchProducts(
  subgraphUrl: string,
  queryVars: SearchProductsQueryQueryVariables = {}
): Promise<SearchProductsQueryQuery["productV1Products"]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  const { productV1Products = [] } = await subgraphSdk.searchProductsQuery({
    ...queryVars
  });

  return productV1Products;
}
