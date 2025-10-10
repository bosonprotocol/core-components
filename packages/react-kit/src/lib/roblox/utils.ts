import { subgraph } from "@bosonprotocol/core-sdk";
import { ASSET_ID_ATTR_TRAIT_TYPE, ROBLOX_PRODUCT_TAG } from "./constants";
import { ConditionStruct, TokenType } from "@bosonprotocol/common";

/**
 * Filter a Boson product, whether it's Roblox-related or not
 * @param offerMetadata the Product Metadata object from Boson subgraph
 * @param condition the ConditionStruct attached to the Boson offer
 * @param nftContract address of the NFT contract used to token-gate the Roblox-Boson offer
 * @param offerMetadata the Product Metadata object from Boson subgraph
 * @returns false if not Roblox-related,
 *  otherwise returns the Roblox assetId the offer is related to
 */
export function filterRobloxProduct(
  offerMetadata: Pick<
    subgraph.ProductV1MetadataEntityFieldsFragment,
    "attributes"
  > & { product: Pick<subgraph.ProductV1Product, "details_tags"> },
  condition: ConditionStruct | undefined,
  nftContract: string
): string | false {
  if (
    offerMetadata.product &&
    offerMetadata.product.details_tags &&
    offerMetadata.product.details_tags
      .map((t) => t.toLowerCase())
      .includes(ROBLOX_PRODUCT_TAG.toLowerCase())
  ) {
    const robloxAssetId = offerMetadata.attributes?.find(
      (attr) =>
        attr.traitType.toLowerCase() === ASSET_ID_ATTR_TRAIT_TYPE.toLowerCase()
    )?.value;
    if (
      condition &&
      robloxAssetId &&
      checkTokenGatingCondition(condition, {
        tokenId: robloxAssetId,
        nftContract
      })
    ) {
      return robloxAssetId;
    }
  }
  return false;
}

function checkTokenGatingCondition(
  condition: ConditionStruct,
  expected: { tokenId: string; nftContract: string }
): boolean {
  return (
    condition.minTokenId.toString() === expected.tokenId &&
    condition.maxTokenId.toString() === expected.tokenId &&
    condition.tokenType === TokenType.MultiToken &&
    condition.tokenAddress === expected.nftContract.toLowerCase()
  );
}
