import { getEnvConfigs } from "@bosonprotocol/core-sdk";
import { ChainId } from "@uniswap/sdk-core";
import { Connector } from "@web3-react/types";
import { useCallback } from "react";
import { FALLBACK_URLS, getRpcUrls } from "../../lib/const/networks";
import { useChainId } from "./connection";
import { useAppDispatch } from "../../state/hooks";
import {
  ChainId_BASE_SEPOLIA,
  ChainId_POLYGON_AMOY,
  SupportedChainsType,
  isSupportedChain
} from "../../lib/const/chains";
import {
  endSwitchingChain,
  startSwitchingChain
} from "../../state/wallets/reducer";
import { useConnections } from "../../components/connection/ConnectionsProvider";
import { getChainInfo } from "../../lib/const/chainInfo";
import { useConfigContext } from "../../components/config/ConfigContext";

const localChainId = 31337;
const localRpcUrl = getEnvConfigs("local").find(
  (localConfig) => localConfig.chainId === localChainId
)?.jsonRpcUrl;
function getRpcUrl(
  chainId: SupportedChainsType,
  RPC_URLS: ReturnType<typeof getRpcUrls>
): string {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.GOERLI:
    case ChainId.SEPOLIA:
    case ChainId.POLYGON:
    case ChainId_POLYGON_AMOY:
    case ChainId.BASE:
    case ChainId_BASE_SEPOLIA: // BASE SEPOLIA
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_SEPOLIA:
    case ChainId.ARBITRUM_ONE:
    case ChainId.ARBITRUM_SEPOLIA:
      return RPC_URLS[chainId][0];
    case localChainId: {
      if (localRpcUrl) {
        return localRpcUrl;
      }
      throw new Error(`chain ${localChainId} is not supported`);
    }
    case ChainId.ZORA:
    case ChainId.ZORA_SEPOLIA:
    case ChainId.ROOTSTOCK:
    case ChainId.BLAST:
    case ChainId.ARBITRUM_SEPOLIA:
      throw new Error(`${chainId} is not supported`);
    // Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
    // MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
    // See the definition of FALLBACK_URLS for more details.
    default:
      return FALLBACK_URLS[chainId][0];
  }
}

export function useSwitchChain(doConnect = true) {
  const connectedChain = useChainId();
  const { config, infuraKey } = useConfigContext();
  const RPC_URLS = getRpcUrls(infuraKey);

  // if you are connected, all good
  // if you are not, then do nothing if it's from the chainselector (doConnect = false)
  const dispatch = useAppDispatch();
  const connectionsObj = useConnections();
  return useCallback(
    async (connector: Connector, chainId: ChainId) => {
      if (!connectedChain && !doConnect) {
        return;
      }
      if (!isSupportedChain({ chainId, envName: config.envName })) {
        throw new Error(
          `Chain ${chainId} not supported for connector (${typeof connector})`
        );
      } else {
        dispatch(startSwitchingChain(chainId));
        try {
          if (
            [
              connectionsObj.walletConnectV2Connection.connector,
              connectionsObj.coinbaseWalletConnection.connector,
              connectionsObj.networkConnection.connector
            ].includes(connector)
          ) {
            await connector.activate(chainId);
          } else {
            const info = getChainInfo(chainId);
            const addChainParameter = {
              chainId,
              chainName: info.label,
              rpcUrls: [getRpcUrl(chainId as SupportedChainsType, RPC_URLS)],
              nativeCurrency: info.nativeCurrency,
              blockExplorerUrls: [info.explorer]
            };
            await connector.activate(addChainParameter);
          }
        } catch (error) {
          // In activating a new chain, the connector passes through a deactivated state.
          // If we fail to switch chains, it may remain in this state, and no longer be usable.
          // We defensively re-activate the connector to ensure the user does not notice any change.
          try {
            await connector.activate();
          } catch (error) {
            console.error("Failed to re-activate connector", error);
          }
          throw error;
        } finally {
          dispatch(endSwitchingChain());
        }
      }
    },
    [
      RPC_URLS,
      config.envName,
      connectedChain,
      connectionsObj.coinbaseWalletConnection.connector,
      connectionsObj.networkConnection.connector,
      connectionsObj.walletConnectV2Connection.connector,
      dispatch,
      doConnect
    ]
  );
}
