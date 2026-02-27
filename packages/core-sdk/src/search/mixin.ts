import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "../mixins/base-core-sdk";
import { searchProducts } from "./subgraph";
import * as subgraph from "../subgraph";

export class SearchMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /**
   * Search for products matching the given keywords.
   *
   * By default, only products that are currently valid (based on their validity dates) are returned.
   * This behavior can be controlled via the `includeInvalidOffers` option in the queryVars parameter.
   *
   * @param keywords - List of keywords to match against product title, description, and tags.
   * @param queryVars - Optional query variables including pagination (productsSkip, productsFirst), 
   *                   ordering (productsOrderBy, productsOrderDirection), filtering (productsFilter),
   *                   and includeInvalidOffers flag to control validity filtering.
   * @returns A promise that resolves to an array of product search result fragments.
   */
  public async searchProducts(
    keywords: string[],
    queryVars?: subgraph.SearchProductsQueryQueryVariables & {
      includeInvalidOffers?: boolean;
    }
  ): Promise<subgraph.ProductSearchResultFieldsFragment[]> {
    if (!keywords || keywords.length === 0) {
      return [];
    }
    const now = Math.floor(Date.now() / 1000);
    const validOffersFilter: subgraph.ProductV1Product_Filter = {
      allVariantsVoided_not: true,
      minValidFromDate_lte: now + 60 + "", // Add 1 minute to ensure we include offers not valid yet, but valid in a very little time
      maxValidUntilDate_gte: now + ""
    };
    const productsSearchFilter: subgraph.ProductV1Product_Filter = {
      or: keywords
        .map((keyword) => [
          { title_contains_nocase: keyword },
          { description_contains_nocase: keyword },
          { details_tags_contains_nocase: [keyword] }
        ])
        .flat()
    };
    const productsFilter: subgraph.ProductV1Product_Filter =
      queryVars?.includeInvalidOffers
        ? queryVars?.productsFilter
          ? {
              and: [
                {
                  ...queryVars.productsFilter
                },
                productsSearchFilter
              ]
            }
          : productsSearchFilter
        : {
            and: [
              {
                ...validOffersFilter,
                ...queryVars?.productsFilter
              },
              productsSearchFilter
            ]
          };
    return searchProducts(this._subgraphUrl, {
      ...queryVars,
      productsFilter
    });
  }
}
