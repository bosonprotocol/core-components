/* eslint-disable @typescript-eslint/no-explicit-any */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never;
