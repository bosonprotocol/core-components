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
    statuses?: string[];
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
  getWalletAuth: ({ backendOrigin }: { backendOrigin: string }) =>
    ["get-wallet-auth", backendOrigin] as const
} as const satisfies GetMutationKey;

export type MutationKey = (typeof mutationKeys)[keyof typeof mutationKeys];
