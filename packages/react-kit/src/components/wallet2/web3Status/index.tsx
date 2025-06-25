import { useWeb3React } from "@web3-react/core";
import React, { ReactNode, memo, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { useIsMagicLoggedIn } from "../../../hooks";
import { useAccount, useChainId } from "../../../hooks/connection/connection";
import { useENSName } from "../../../hooks/ens/useENSName";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { useLast } from "../../../hooks/useLast";
import { formatAddress } from "../../../lib/address/address";
import {
  getConfigsByChainId,
  getEnvConfigsFilteredByEnv
} from "../../../lib/config/getConfigsByChainId";
import { CHAIN_IDS_TO_FRIENDLY_NAMES } from "../../../lib/const/chains";
import { useAppSelector } from "../../../state/hooks";
import { BaseButton, BaseButtonTheme } from "../../buttons/BaseButton";
import { useConfigContext } from "../../config/ConfigContext";
import {
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";
import { Tooltip } from "../../tooltip/Tooltip";
import { Grid } from "../../ui/Grid";
import { useAccountDrawer } from "../accountDrawer";
import StatusIcon from "../identicon/StatusIcon";

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`;

const getCommonWalletButtonProps = (isXXS: boolean) =>
  ({
    tabIndex: 0,
    size: isXXS ? "small" : "regular",
    style: {
      whiteSpace: "pre"
    }
  }) as const;
function Web3StatusInner({
  showOnlyIcon,
  errorButtonTheme,
  connectedButtonTheme,
  connectWalletButtonTheme,
  connectWalletButtonDisabled,
  connectWalletChild = <>Connect account</>,
  showStatusIcon = true,
  wrongNetworkChild = <>Wrong network</>,
  leftConnectWalletChild,
  leftConnectedChild,
  leftWrongNetworkChild,
  rightConnectWalletChild,
  rightConnectedChild,
  rightWrongNetworkChild,
  hideConnectedAddress
}: ConnectWalletProps) {
  const switchingChain = useAppSelector(
    (state) => state.wallets.switchingChain
  );
  const ignoreWhileSwitchingChain = useCallback(
    () => !switchingChain,
    [switchingChain]
  );
  const { address: account } = useLast(useAccount(), ignoreWhileSwitchingChain);

  const { isActive } = useWeb3React();
  const { config } = useConfigContext();
  const chainId = useChainId();
  const accountRef = useRef(account);
  const chainIdRef = useRef(chainId);
  useEffect(() => {
    if (account && !accountRef.current) {
      accountRef.current = account;
    }
  }, [account]);
  useEffect(() => {
    if (account && chainId && chainId !== chainIdRef.current) {
      chainIdRef.current = chainId;
    }
  }, [chainId, account]);

  const { isXXS } = useBreakpoints();

  const { connector } = useLast(useWeb3React(), ignoreWhileSwitchingChain);
  const connection = getConnection(connector, useConnections());
  const { ENSName } = useENSName(account);

  const [, toggleAccountDrawer] = useAccountDrawer();
  const handleWalletDropdownClick = useCallback(() => {
    toggleAccountDrawer();
  }, [toggleAccountDrawer]);
  const wasConnected = !!accountRef.current;
  const previousChainId = chainIdRef.current;
  const configsPreviousChain = getConfigsByChainId(
    previousChainId,
    config.envName
  );
  const configsCurrentChain = getConfigsByChainId(chainId, config.envName);
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const connectedToWrongChainId = isMagicLoggedIn
    ? false
    : account
      ? !configsCurrentChain?.length
      : wasConnected && !configsPreviousChain?.length && isActive;

  if (!connectedToWrongChainId && account) {
    const connectedText = ENSName || formatAddress(account);
    return (
      <BaseButton
        disabled={Boolean(switchingChain)}
        data-testid="web3-status-connected"
        onClick={handleWalletDropdownClick}
        theme={connectedButtonTheme}
      >
        {showStatusIcon && (
          <StatusIcon
            account={account}
            size={24}
            connection={connection}
            showMiniIcons={showOnlyIcon}
          />
        )}
        {leftConnectedChild}
        {!hideConnectedAddress && <Text>{connectedText}</Text>}
        {rightConnectedChild}
      </BaseButton>
    );
  }

  return (
    <Grid justifyContent="center" flexDirection="column">
      {connectedToWrongChainId ? (
        <Tooltip
          content={
            <div>
              Connect to{" "}
              {getEnvConfigsFilteredByEnv(config.envName)
                .map(
                  (config) =>
                    `${
                      CHAIN_IDS_TO_FRIENDLY_NAMES[
                        config.chainId as keyof typeof CHAIN_IDS_TO_FRIENDLY_NAMES
                      ]
                    } (${config.chainId})`
                )
                .join(", ")}{" "}
              and click here again
            </div>
          }
        >
          <BaseButton
            {...getCommonWalletButtonProps(isXXS)}
            onClick={handleWalletDropdownClick}
            theme={errorButtonTheme}
          >
            {leftWrongNetworkChild}
            {wrongNetworkChild}
            {rightWrongNetworkChild}
          </BaseButton>
        </Tooltip>
      ) : (
        <BaseButton
          disabled={connectWalletButtonDisabled}
          onClick={handleWalletDropdownClick}
          data-testid="navbar-connect-wallet"
          {...getCommonWalletButtonProps(isXXS)}
          theme={connectWalletButtonTheme}
          style={{
            ...getCommonWalletButtonProps(isXXS).style
          }}
        >
          {leftConnectWalletChild}
          {connectWalletChild}
          {rightConnectWalletChild}
        </BaseButton>
      )}
    </Grid>
  );
}
type SuccessButtonTheme = Omit<BaseButtonTheme, "color" | "background"> &
  Required<Pick<BaseButtonTheme, "color" | "background">>;

export type ConnectWalletProps = {
  showOnlyIcon?: boolean;
  errorButtonTheme: BaseButtonTheme;
  connectedButtonTheme: SuccessButtonTheme;
  connectWalletButtonTheme: SuccessButtonTheme;
  connectWalletChild?: ReactNode;
  connectWalletButtonDisabled?: boolean;
  wrongNetworkChild?: ReactNode;
  showStatusIcon?: boolean;
  leftConnectedChild?: ReactNode;
  rightConnectedChild?: ReactNode;
  leftWrongNetworkChild?: ReactNode;
  rightWrongNetworkChild?: ReactNode;
  leftConnectWalletChild?: ReactNode;
  rightConnectWalletChild?: ReactNode;
  hideConnectedAddress?: boolean;
};
export const ConnectWallet = memo(function Web3Status(
  props: ConnectWalletProps
) {
  return (
    <div>
      <Web3StatusInner {...props} />
    </div>
  );
});
