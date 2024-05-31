import React from "react";
import { useWeb3React } from "@web3-react/core";
import { memo, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { flexRowNoWrap } from "../styles";
import { breakpoint, breakpointNumbers } from "../../../lib/ui/breakpoint";
import { Button } from "../../buttons/Button";
import { useAccount, useChainId } from "../../../hooks/connection/connection";
import { useLast } from "../../../hooks/useLast";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { useENSName } from "../../../hooks/ens/useENSName";
import StatusIcon from "../identicon/StatusIcon";
import { formatAddress } from "../../../lib/address/address";
import { useIsMagicLoggedIn } from "../../../hooks";
import { useAccountDrawer } from "../accountDrawer";
import { Grid } from "../../ui/Grid";
import { Tooltip } from "../../tooltip/Tooltip";
import ThemedButton from "../../ui/ThemedButton";
import { CHAIN_IDS_TO_FRIENDLY_NAMES } from "../../../lib/const/chains";
import { useAppSelector } from "../../../state/hooks";
import {
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";
import {
  getConfigsByChainId,
  getEnvConfigsFilteredByEnv
} from "../../../lib/config/getConfigsByChainId";
import { useConfigContext } from "../../config/ConfigContext";
import { BaseButton, BaseButtonTheme } from "../../buttons/BaseButton";

const Web3StatusGeneric = styled.button`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;

  margin-right: 2px;
  margin-left: 2px;
  &:focus {
    outline: none;
  }
`;

const breakpointWhenConnectButtonOverflows = "1300px";
const Web3StatusConnected = styled(Web3StatusGeneric)<{
  $color: string;
  $backgroundColor: string;
}>`
  border: 2px solid transparent;
  width: auto;
  font-weight: 500;
  color: ${({ $color }) => $color};
  &:hover,
  &:focus {
    border: 2px solid
      color-mix(
        in srgb,
        ${({ $backgroundColor }) => $backgroundColor} 90%,
        black
      );
  }
  @media (min-width: ${breakpointNumbers.xs}px) and (max-width: ${breakpointNumbers.l -
    1}px) {
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    border: 2px solid ${({ $backgroundColor }) => $backgroundColor};
  }
  @media (min-width: ${breakpointWhenConnectButtonOverflows}) {
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    border: 2px solid ${({ $backgroundColor }) => $backgroundColor};
  }
  ${breakpoint.xxs} {
    border-radius: 8px;
    margin: initial;
    * {
      margin: initial;
    }
  }
  @media (min-width: ${breakpointNumbers.l}px) and (max-width: ${breakpointWhenConnectButtonOverflows}) {
    border-radius: 8px;
    margin: initial;
    * {
      margin: initial;
    }
  }
`;

const AddressAndChevronContainer = styled.div`
  display: flex;

  ${breakpoint.xxs} {
    display: none;
  }
  @media (min-width: ${breakpointNumbers.l}px) and (max-width: ${breakpointWhenConnectButtonOverflows}) {
    display: none;
  }
  @media (min-width: ${breakpointWhenConnectButtonOverflows}) {
    display: flex;
  }
`;

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
  successButtonTheme
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
    return (
      <Web3StatusConnected
        disabled={Boolean(switchingChain)}
        data-testid="web3-status-connected"
        onClick={handleWalletDropdownClick}
        $color={successButtonTheme.color}
        $backgroundColor={successButtonTheme.background}
      >
        <StatusIcon
          account={account}
          size={24}
          connection={connection}
          showMiniIcons={showOnlyIcon}
        />

        <AddressAndChevronContainer>
          <Text>{ENSName || formatAddress(account)}</Text>
        </AddressAndChevronContainer>
      </Web3StatusConnected>
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
            Wrong network
          </BaseButton>
        </Tooltip>
      ) : (
        <BaseButton
          onClick={handleWalletDropdownClick}
          data-testid="navbar-connect-wallet"
          {...getCommonWalletButtonProps(isXXS)}
          theme={successButtonTheme}
          style={{
            ...getCommonWalletButtonProps(isXXS).style
          }}
        >
          Connect Wallet
        </BaseButton>
      )}
    </Grid>
  );
}

export type ConnectWalletProps = {
  showOnlyIcon?: boolean;
  errorButtonTheme: BaseButtonTheme;
  successButtonTheme: Omit<BaseButtonTheme, "color" | "background"> &
    Required<Pick<BaseButtonTheme, "color" | "background">>;
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
