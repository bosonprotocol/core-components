// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
interface GetMutationKey
  // This any will be infered, it is more like generic, will be never seen as any in use
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Record<string, (...args: any[]) => readonly [string, ...string[]]> {}

export const mutationKeys = {
  getProducts: ({
    backendOrigin,
    sellerId
  }: {
    backendOrigin: string;
    sellerId: string;
  }) => ["roblox-products", backendOrigin, sellerId] as const,
  getWalletAuth: ({ backendOrigin }: { backendOrigin: string }) =>
    ["get-wallet-auth", backendOrigin] as const
} as const satisfies GetMutationKey;

export type MutationKey = (typeof mutationKeys)[keyof typeof mutationKeys];
