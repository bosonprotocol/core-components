import {
  GetLoggedInResponse,
  GetWalletAuthResponse
} from "@bosonprotocol/roblox-sdk";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
interface GetMutationKey
  // This any will be infered, it is more like generic, will be never seen as any in use
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Record<string, (...args: any[]) => readonly [string, ...unknown[]]> {}

export const mutationKeys = {
  getProducts: ({
    backendOrigin,
    sellerId,
    pageSize,
    statuses
  }: {
    backendOrigin: string;
    sellerId: string;
    pageSize: number;
    statuses?: string[] | Readonly<string[]>;
  }) =>
    ["roblox-products", backendOrigin, sellerId, pageSize, statuses] as const,
  getExchanges: ({
    backendOrigin,
    sellerId,
    userWallet,
    pageSize
  }: {
    backendOrigin: string;
    sellerId: string;
    userWallet: string;
    pageSize: number;
  }) =>
    [
      "roblox-exchanges",
      backendOrigin,
      sellerId,
      userWallet,
      pageSize
    ] as const,
  getWalletAuth: ({
    backendOrigin,
    address
  }: {
    backendOrigin: string;
    address: string;
  }) => ["get-wallet-auth", backendOrigin, address] as const,
  postWalletAuth: ({
    address,
    isAuthChecked,
    robloxLoggedInData
  }: {
    address: string;
    isAuthChecked: GetWalletAuthResponse | undefined;
    robloxLoggedInData: GetLoggedInResponse | null | undefined;
  }) =>
    [
      "post-wallet-auth",
      address,
      !!isAuthChecked?.walletAuth,
      robloxLoggedInData
    ] as const
} as const satisfies GetMutationKey;

export type MutationKey = (typeof mutationKeys)[keyof typeof mutationKeys];
