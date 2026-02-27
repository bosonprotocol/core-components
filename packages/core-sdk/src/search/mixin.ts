import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "../mixins/base-core-sdk";
import { searchProducts } from "./subgraph";
import * as subgraph from "../subgraph";

export class SearchMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /**
   * Search for products matching the given keywords.
   *
   * Only products that are currently valid (based on their validity dates) are returned.
   *
   * @param keywords - List of keywords to match against product title, description, and tags.
   * @returns A promise that resolves to an array of product search result fragments.
   */
  public async searchProducts(
    keywords: string[]
  ): Promise<subgraph.ProductSearchResultFieldsFragment[]> {
    const now = Math.floor(Date.now() / 1000) + 10; // Add 10 seconds to ensure we don't have issues with products that are just becoming valid

    const productsFilter: subgraph.ProductV1Product_Filter = {
      and: [
        {
          allVariantsVoided_not: true,
          minValidFromDate_lte: now + "",
          maxValidUntilDate_gte: now + ""
        },
        {
          or: keywords
            .map((keyword) => [
              { title_contains_nocase: keyword },
              { description_contains_nocase: keyword },
              { details_tags_contains_nocase: [keyword] }
            ])
            .flat()
        }
      ]
    };
    return searchProducts(this._subgraphUrl, {
      productsFilter
    });
  }
}
