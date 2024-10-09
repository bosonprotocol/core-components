import { ConfigId, EnvironmentType } from "@bosonprotocol/core-sdk";
import { Web3Provider } from "../../../wallet2/web3Provider";
import React from "react";

export type WithProvidersProps = {
  config: {
    configId: ConfigId;
    envName: EnvironmentType;
    infuraKey: string;
    magicLinkKey: string;
    walletConnectProjectId: string;
  };
};
export const withProviders = <P extends WithProvidersProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  type Props = P;
  // Return a new component
  const withProviders: React.FC<Props> = (props) => {
    const { config } = props;
    return (
      <Web3Provider
        configProps={{
          configId: config.configId,
          dateFormat: "YYYY/MM/DD",
          defaultCurrencySymbol: "USD",
          defaultCurrencyTicker: "$",
          envName: config.envName,
          infuraKey: config.infuraKey,
          magicLinkKey: config.magicLinkKey,
          shortDateFormat: "MMM DD, YYYY",
          walletConnectProjectId: config.walletConnectProjectId,
          withWeb3React: true,
          externalConnectedAccount: undefined,
          externalConnectedChainId: undefined,
          externalConnectedSigner: undefined,
          metaTx: undefined,
          usePendingTransactions: undefined,
          withExternalConnectionProps: false,
          withCustomReduxContext: false
        }}
      >
        <WrappedComponent {...props} />
      </Web3Provider>
    );
  };

  // Set display name for debugging purposes
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  withProviders.displayName = `withProviders(${displayName})`;

  return withProviders;
};
