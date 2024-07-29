import { ProtocolConfig } from "@bosonprotocol/core-sdk";
import { createContext, useContext } from "react";
import { Signer } from "ethers";
import { Signer as SignerV6 } from "ethers-v6";

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
  externalConnectedSignerV6?: SignerV6;
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
