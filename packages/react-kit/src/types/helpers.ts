/* eslint-disable @typescript-eslint/ban-types */
export type DeepReadonly<T> = {
  // TODO: remove once https://github.com/microsoft/TypeScript/issues/13923 is merged
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Falsy = false | 0 | "" | null | undefined;

export const isTruthy = <T>(x: T | Falsy): x is T => !!x;

export type AddDollarPrefixToKeys<T> = {
  [K in keyof T as `$${string & K}`]: T[K];
};
