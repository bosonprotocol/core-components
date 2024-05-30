import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import styled from "styled-components";

import { Grid } from "../../ui/Grid";
import { flexColumnNoWrap } from "../styles";
import ConnectionErrorView from "./ConnectionErrorView";
import { Option, OptionProps } from "./Option";
import {
  ActivationStatus,
  useActivationState
} from "../../connection/activate";
import { MagicLoginButton, MagicLoginButtonProps } from "../../magicLink/Login";
import { useChainId } from "../../../hooks/connection/connection";
import { breakpoint } from "../../../lib/ui/breakpoint";
import { AutoColumn } from "../../ui/column";
import { useConnections } from "../../connection/ConnectionsProvider";
import { isSupportedChain } from "../../../lib/const/chains";
import { useConfigContext } from "../../config/ConfigContext";

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  width: 100%;
  padding: 14px 16px 16px;
  flex: 1;
`;

const OptionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 2px;
  border-radius: 12px;
  overflow: hidden;
  ${breakpoint.m} {
    grid-template-columns: 1fr;
  }
`;

export type WalletModalProps = {
  PrivacyPolicy: React.FC;
  magicLoginButtonProps?: MagicLoginButtonProps;
  optionProps: Pick<
    OptionProps,
    | "headerTextColor"
    | "hoverFocusBackgroundColor"
    | "hoverTextColor"
    | "backgroundColor"
  >;
};
export function WalletModal({
  PrivacyPolicy,
  magicLoginButtonProps,
  optionProps
}: WalletModalProps) {
  const chainId = useChainId();
  const { config } = useConfigContext();
  const { connector } = useWeb3React();
  const connectionsObj = useConnections();
  const { activationState } = useActivationState();

  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (
      chainId &&
      isSupportedChain({ chainId, envName: config.envName }) &&
      connector !== connectionsObj.networkConnection.connector
    ) {
      connectionsObj.networkConnection.connector.activate(chainId);
    }
  }, [
    chainId,
    connectionsObj.networkConnection.connector,
    connector,
    config.envName
  ]);
  const connections = Object.values(connectionsObj);
  return (
    <Wrapper data-testid="wallet-modal">
      <Grid justifyContent="space-between" marginBottom="16px">
        Connect a wallet
      </Grid>
      {activationState.status === ActivationStatus.ERROR ? (
        <ConnectionErrorView />
      ) : (
        <AutoColumn $gap="16px">
          <OptionGrid data-testid="option-grid">
            {connections
              .filter((connection) => connection.shouldDisplay())
              .map((connection) => (
                <Option
                  {...optionProps}
                  key={connection.getName()}
                  connection={connection}
                />
              ))}
          </OptionGrid>
          <MagicLoginButton {...magicLoginButtonProps} />
          <PrivacyPolicy />
        </AutoColumn>
      )}
    </Wrapper>
  );
}
