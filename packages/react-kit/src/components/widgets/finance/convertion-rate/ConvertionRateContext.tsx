/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { createContext } from "react";
import { getItemFromStorage } from "../../../../hooks/storage/useBosonLocalStorage";

export type Token = {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
};

export type Store = {
  type: string | null;
  tokens: Token[] | null;
  rates: any;
  fixed: number;
  isLoading: boolean;
};

export interface ConvertionRateContextType {
  updateProps: (store: Store) => void;
  store: Store;
}

const MOCK_RATES = [
  { to: "WETH", from: "USD", value: 1602.94 },
  { to: "MATIC", from: "USD", value: 0.859599 },
  { to: "DAI", from: "USD", value: 0.998621 },
  { to: "BOSON", from: "USD", value: 0.244912 }
];

export const initalState: ConvertionRateContextType = {
  updateProps: () => {},
  store: {
    type: null,
    tokens: null,
    rates:
      process.env.NODE_ENV === "development" ||
      // @ts-expect-error import.meta.env only exists in vite environments
      import.meta?.env?.DEV
        ? MOCK_RATES
        : getItemFromStorage("convertionRates", null),
    fixed: 20,
    isLoading: true
  } as const
};

const ConvertionRateContext = createContext(
  initalState as ConvertionRateContextType
);

export default ConvertionRateContext;
