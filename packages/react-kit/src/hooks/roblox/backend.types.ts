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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export type RobloxInventoryItem = {
  path: string;
  assetDetails: {
    assetId: string;
  };
};

export type GetInfoResponse = {
  userId: string;
  claims: RobloxClaims;
  inventoryItems: RobloxInventoryItem[];
};

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

export type GetProductsResponse = BosonRobloxProductWithAvailability[];

export type GetExchangesResponse = BosonRobloxExchange[];
