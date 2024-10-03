/* eslint-disable @typescript-eslint/no-explicit-any */
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

//#region Omit doesnt work well when using it with a type that has [x:string]: any, in that case there is no autocomplete: https://github.com/microsoft/TypeScript/issues/31153
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? {} extends U
    ? never
    : U
  : never; // I don't know why not just U work here, but ({} extends U ? never : U) work

type OmitFromKnownKeys<T, K extends keyof T> =
  KnownKeys<T> extends infer U
    ? [U] extends [keyof T]
      ? Pick<T, Exclude<U, K>>
      : never
    : never;
export type ExtendedOmit<T, K extends keyof T> = OmitFromKnownKeys<T, K> &
  (string extends K
    ? {}
    : string extends keyof T
      ? { [n: string]: T[Exclude<keyof T, number>] }
      : {}) & // support number property
  (number extends K
    ? {}
    : number extends keyof T
      ? { [n: number]: T[Exclude<keyof T, string>] }
      : {}); // support number property
//#endregion
