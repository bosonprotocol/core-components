import { ProtocolConfig } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";
import { Signer } from "ethers";

export type ConfigContextProps = {
  config: ProtocolConfig;
  dateFormat: string;
  shortDateFormat: string;
  defaultCurrency: {
    ticker: "USD" | string;
    symbol: "$" | string;
  };
  usePendingTransactions?: boolean;
  magicLinkKey: string;
  infuraKey: string;
  supportedChains: number[];
  externalConnectedChainId?: number;
  externalConnectedAccount?: string;
  externalConnectedSigner?: Signer;
  withExternalConnectionProps?: boolean;
  withWeb3React: boolean;
  withCustomReduxContext?: boolean;
};

export const ConfigContext = createContext<
  | (ConfigContextProps & {
      setEnvConfig: React.Dispatch<React.SetStateAction<ProtocolConfig>>;
    })
  | null
>(null);

export const useConfigContext = () => {
  const contextValue = useContext(ConfigContext);
  if (!contextValue) {
    throw new Error(
      "You need to use ConfigProvider before using useConfigContext"
    );
  }
  return contextValue;
};
