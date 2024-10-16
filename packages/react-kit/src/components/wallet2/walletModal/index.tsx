import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import styled, { CSSProperties } from "styled-components";

import { Grid } from "../../ui/Grid";
import { flexColumnNoWrap } from "../styles";
import ConnectionErrorView, {
  ConnectionErrorViewProps
} from "./ConnectionErrorView";
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

const OptionGrid = styled.div<{ $borderRadius: CSSProperties["borderRadius"] }>`
  width: 100%;
  display: grid;
  grid-gap: 2px;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  overflow: hidden;
  ${breakpoint.m} {
    grid-template-columns: 1fr;
  }
`;

export type WalletModalProps = {
  PrivacyPolicy: React.FC;
  optionProps: Pick<
    OptionProps,
    | "color"
    | "hoverFocusBackgroundColor"
    | "hoverColor"
    | "backgroundColor"
    | "borderRadius"
    | "onOptionClick"
  > & { iconBorderRadius: CSSProperties["borderRadius"] };
  withMagicLogin?: boolean;
  connectionErrorProps: ConnectionErrorViewProps;
} & (
  | { withMagicLogin: true; magicLoginButtonProps: MagicLoginButtonProps }
  | { withMagicLogin?: false; magicLoginButtonProps?: undefined }
);
export function WalletModal({
  PrivacyPolicy,
  magicLoginButtonProps,
  optionProps,
  withMagicLogin = true,
  connectionErrorProps
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
        <ConnectionErrorView {...connectionErrorProps} />
      ) : (
        <AutoColumn $gap="16px">
          <OptionGrid
            data-testid="option-grid"
            $borderRadius={optionProps.borderRadius}
          >
            {connections
              .filter((connection) => connection.shouldDisplay())
              .map((connection) => (
                <Option
                  {...optionProps}
                  borderRadius={optionProps.iconBorderRadius}
                  key={connection.getName()}
                  connection={connection}
                />
              ))}
          </OptionGrid>
          {withMagicLogin && magicLoginButtonProps && (
            <MagicLoginButton {...magicLoginButtonProps} />
          )}
          <PrivacyPolicy />
        </AutoColumn>
      )}
    </Wrapper>
  );
}
