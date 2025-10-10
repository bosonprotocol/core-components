import { subgraph } from "@bosonprotocol/core-sdk";

export type RobloxClaims = {
  sub: string;
  name: string;
  nickname?: string;
  picture?: string;
  preferred_username?: string;
  email?: string;
  profile?: string;
};

export type RobloxUser = Omit<RobloxClaims, "sub"> & { userId: string };

/**
 * Product Metadata subgraph, with related Roblox assetId
 */
export type BosonRobloxProduct =
  subgraph.ProductV1MetadataEntityFieldsFragment & {
    robloxAssetId: string;
  };

export type BosonRobloxExchange = subgraph.ExchangeFieldsFragment & {
  robloxAssetId: string;
};

export type RobloxInventoryItem = {
  path: string;
  assetDetails: {
    assetId: string;
  };
};

export type RobloxAsset = {
  productType: string;
  assetId: string;
  productId: number;
  name: string;
  description: string;
  iconImageAssetId: number;
  assetTypeId: number;
  isLimited: boolean;
  isLimitedUnique: boolean;
};

export type GetInfoResponse = {
  userId: string;
  claims: RobloxClaims;
  inventoryItems: RobloxInventoryItem[];
};

export type GetAssetDetailsResponse = RobloxAsset;

export type GetLoggedInResponse = {
  isLoggedIn: boolean;
  claims: RobloxClaims | null;
  nonce: string | null;
};

export type GetWalletAuthResponse = {
  walletAuth: boolean;
  address: string | null;
  sellerId: string | null;
};

export type PendingRequest = { txHash: string; txId: string };

/**
 * A Product can be:
 * - Unknown: the user is not authenticated on roblox
 * - Not available: the roblox user is authenticated and it doesn't have the required Roblox asset
 * - Potentially: the roblox user is authenticated and it has the required Roblox asset, the user wallet is not known yet
 * - Pending: the roblox user is authenticated and it has the required Roblox asset and their wallet doesn't own the required NFT yet (minting is pending)
 * - Available: the roblox user is authenticated and it has the required Roblox asset and their wallet owns the required NFT
 *  */
export type ProductAvailabilityStatus =
  | { status: "UNKNOWN" | "POTENTIALLY" | "NOT_AVAILABLE" | "AVAILABLE" }
  | { status: "PENDING"; pendingData: PendingRequest };

export type BosonRobloxProductWithAvailability = BosonRobloxProduct & {
  availability: ProductAvailabilityStatus;
};

export type HasMore = true | false | "maybe";

export type GetProductsResponse = {
  products: BosonRobloxProductWithAvailability[];
  hasMore: HasMore;
};

export type GetExchangesResponse = {
  exchanges: BosonRobloxExchange[];
  hasMore: HasMore;
};
