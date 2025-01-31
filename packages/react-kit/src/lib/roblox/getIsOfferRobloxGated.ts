import { subgraph } from "@bosonprotocol/core-sdk";
import { isProductV1 } from "../offer/filter";
import { filterRobloxProduct } from "@bosonprotocol/roblox-sdk";
type GetIsOfferRobloxGatedProps = {
  offer: subgraph.OfferFieldsFragment;
};

type RobloxAssetId = string;
export function getIsOfferRobloxGated({
  offer
}: GetIsOfferRobloxGatedProps): RobloxAssetId | false {
  if (offer.metadata && isProductV1(offer) && offer.condition) {
    return filterRobloxProduct(
      offer.metadata,
      offer.condition,
      offer.condition?.tokenAddress
    );
  }
  return false;
}
