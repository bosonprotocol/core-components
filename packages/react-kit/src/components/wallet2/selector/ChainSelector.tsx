import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import {
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  Warning as AlertTriangle
} from "phosphor-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { CSSProperties, css } from "styled-components";

import React from "react";
import { ConnectionType } from "../../connection/types";
import { WalletConnectV2 } from "../../connection/WalletConnectV2";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { Portal } from "../../portal/Portal";
import { Tooltip } from "../../tooltip/Tooltip";
import { NavDropdown } from "../navDropdown/NavDropdown";
import ChainSelectorRow from "./ChainSelectorRow";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { getChainInfo } from "../../../lib/const/chainInfo";
import useSyncChainQuery from "../../../hooks/connection/useSyncChainQuery";
import {
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";
import {
  TESTNET_CHAIN_IDS,
  UniWalletSupportedChains,
  getChainPriority
} from "../../../lib/const/chains";
import { useConfigContext } from "../../config/ConfigContext";
import { getEnvConfigsFilteredByEnv } from "../../../lib/config/getConfigsByChainId";
import { useSelectChain } from "../../../hooks/connection/useSelectChain";
import { ConfigId, ProtocolConfig } from "@bosonprotocol/core-sdk";
import { SvgImage } from "../../ui/SvgImage";

const IconAndChevron = styled.div<{
  $isOpen: boolean;
  $backgroundColor: CSSProperties["backgroundColor"];
}>`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 8px;
  flex-direction: row;
  ${({ $isOpen, $backgroundColor }) => css`
    background: ${$isOpen ? $backgroundColor : "none"};
  `}
  border-radius: 8px;
  padding: 1px 6px;
  &:hover {
    background: color-mix(
      in srgb,
      ${({ $backgroundColor }) => $backgroundColor} 90%,
      black
    );
  }
`;

export interface ChainSelectorProps {
  leftAlign?: boolean;
  backgroundColor: CSSProperties["backgroundColor"];
}

function useWalletSupportedChains({
  NETWORK_SELECTOR_CHAINS_IDS
}: {
  NETWORK_SELECTOR_CHAINS_IDS: ChainId[];
}): ChainId[] {
  const { connector } = useWeb3React();

  const connectionType = getConnection(connector, useConnections())?.type;

  switch (connectionType) {
    case ConnectionType.WALLET_CONNECT_V2:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return getSupportedChainIdsFromWalletConnectSession(
        (connector as WalletConnectV2).provider?.session
      );
    case ConnectionType.UNISWAP_WALLET_V2:
      return UniWalletSupportedChains;
    default:
      return NETWORK_SELECTOR_CHAINS_IDS;
  }
}
const chevronProps = {
  height: 20,
  width: 20
};
export const ChainSelector = ({
  leftAlign,
  backgroundColor
}: ChainSelectorProps) => {
  const { config } = useConfigContext();
  const NETWORK_SELECTOR_CHAINS = useMemo(
    () => getEnvConfigsFilteredByEnv(config.envName),
    [config.envName]
  );
  const NETWORK_SELECTOR_CHAINS_IDS = NETWORK_SELECTOR_CHAINS.map(
    (config) => config.chainId as ChainId
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isXS: isMobile } = useBreakpoints();

  const walletSupportsChain = useWalletSupportedChains({
    NETWORK_SELECTOR_CHAINS_IDS
  });

  const [supportedConfigs, unsupportedChains] = useMemo(() => {
    const { supported, unsupported } = NETWORK_SELECTOR_CHAINS.filter((cfg) => {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TESTNET_CHAIN_IDS.includes(cfg.chainId as any)
      );
    })
      .sort(
        ({ chainId: a }, { chainId: b }) =>
          getChainPriority(a as ChainId) - getChainPriority(b as ChainId)
      )
      .reduce(
        (acc, config) => {
          const { chainId: chain } = config;
          if (walletSupportsChain.includes(chain as ChainId)) {
            acc.supported.push(config);
          } else {
            acc.unsupported.push(config);
          }
          return acc;
        },
        { supported: [], unsupported: [] } as Record<string, ProtocolConfig[]>
      );
    return [supported, unsupported];
  }, [NETWORK_SELECTOR_CHAINS, walletSupportsChain]);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef]);
  const info = getChainInfo(config.chainId); // TODO: verify if this is correct or it should be chainId as before
  const [activeConfigId, setActiveConfigId] = useState<ConfigId>(
    config.configId
  );
  useEffect(() => {
    setActiveConfigId(config.configId);
  }, [config.configId]);
  const selectChain = useSelectChain({ throwErrors: true, doConnect: false });
  useSyncChainQuery();

  const [pendingConfigId, setPendingConfigId] = useState<ConfigId>();
  const onSelectChain = useCallback(
    async (config: ProtocolConfig) => {
      try {
        setPendingConfigId(config.configId);
        await selectChain(config.configId);
        setActiveConfigId(config.configId);
      } finally {
        setPendingConfigId(undefined);
        setIsOpen(false);
      }
    },
    [selectChain, setIsOpen]
  );

  const isSupported = !!info;

  const dropdown = (
    <NavDropdown
      left={leftAlign ? "0" : "auto"}
      right={leftAlign ? "auto" : "0"}
      ref={modalRef}
    >
      <div
        data-testid="chain-selector-options"
        style={{ paddingLeft: "8px", paddingRight: "8px" }}
      >
        {supportedConfigs.map((config) => (
          <ChainSelectorRow
            disabled={!walletSupportsChain.includes(config.chainId as ChainId)}
            onSelectChain={() => onSelectChain(config)}
            targetChain={config.chainId as ChainId}
            key={config.configId}
            active={config.configId === activeConfigId}
            isPending={config.configId === pendingConfigId}
          />
        ))}
        {unsupportedChains.map((config) => (
          <ChainSelectorRow
            disabled
            onSelectChain={() => undefined}
            targetChain={config.chainId as ChainId}
            key={config.configId}
            isPending={false}
            active={config.configId === activeConfigId}
          />
        ))}
      </div>
    </NavDropdown>
  );

  return (
    <div style={{ position: "relative", display: "flex" }} ref={ref}>
      <Tooltip
        content={`Your wallet's current network is unsupported.`}
        disabled={isSupported}
      >
        <IconAndChevron
          $isOpen={isOpen}
          $backgroundColor={backgroundColor}
          data-testid="chain-selector"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isSupported ? (
            <AlertTriangle size={20} />
          ) : (
            <SvgImage
              src={info.logoUrl}
              alt={info.label}
              style={{
                width: "20px",
                height: "20px"
              }}
              data-testid="chain-selector-logo"
            />
          )}
          {isOpen ? (
            <ChevronUp {...chevronProps} />
          ) : (
            <ChevronDown {...chevronProps} />
          )}
        </IconAndChevron>
      </Tooltip>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </div>
  );
};
