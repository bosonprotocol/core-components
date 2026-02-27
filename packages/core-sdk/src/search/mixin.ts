import { Web3LibAdapter } from "@bosonprotocol/common";
import { BaseCoreSDK } from "../mixins/base-core-sdk";
import { searchProducts } from "./subgraph";
import * as subgraph from "../subgraph";

export class SearchMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  public async searchProducts(
    keywords: string[]
  ): Promise<subgraph.ProductSearchResultFieldsFragment[]> {
    const now = Math.floor(Date.now() / 1000);

    const productsFilter: subgraph.ProductV1Product_Filter = {
      and: [
        {
          allVariantsVoided_not: true,
          minValidFromDate_lte: now + 60 + "", // Add 1 minute to ensure we include offers not valid yet, but valid in a very little time
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
