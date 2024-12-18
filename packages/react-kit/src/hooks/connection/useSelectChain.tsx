import { ChainId } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useConfigContext } from "../../components/config/ConfigContext";
import { useIsMagicLoggedIn } from "../magic";
import { ConfigId } from "@bosonprotocol/core-sdk";
import {
  getConnection,
  useConnections
} from "../../components/connection/ConnectionsProvider";
import { isSupportedChain } from "../../lib/const/chains";
import { configQueryParameters } from "../../lib/const/parameters";
import { didUserReject } from "../../components/connection/utils";
import { colors } from "../../theme";
import { Typography } from "../../components/ui/Typography";
import ErrorToast from "../../components/toasts/common/ErrorToast";
import { useSwitchChain } from "./useSwitchChain";
import { getEnvConfigsFilteredByEnv } from "../../lib/config/getConfigsByChainId";

export function useSelectChain(
  { throwErrors, doConnect }: { throwErrors: boolean; doConnect: boolean } = {
    throwErrors: false,
    doConnect: false
  }
) {
  const { setEnvConfig, config } = useConfigContext();
  const { connector } = useWeb3React();
  const connectionsObj = useConnections();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const switchChain = useSwitchChain(doConnect);
  const [searchParams, setSearchParams] = useSearchParams();

  return useCallback(
    async (newConfigId: ConfigId | undefined) => {
      if (!newConfigId) return;
      if (!connector) return;

      const connection = getConnection(connector, connectionsObj);

      try {
        const newConfig = getEnvConfigsFilteredByEnv(config.envName).find(
          (cfg) => cfg.configId === newConfigId
        );
        if (!newConfig) {
          return;
        }
        const targetChain = newConfig.chainId as ChainId;
        if (!isMagicLoggedIn) {
          await switchChain(connector, targetChain);
        }
        if (
          isSupportedChain({ chainId: targetChain, envName: newConfig.envName })
        ) {
          searchParams.set(configQueryParameters.configId, newConfigId);
          setSearchParams(searchParams);
          setEnvConfig(newConfig);
        }
      } catch (error) {
        if (
          !didUserReject(connection, error) &&
          (error as { code: number }).code !==
            -32002 /* request already pending */
        ) {
          console.error("Failed to switch networks", error);
          toast((t) => (
            <ErrorToast t={t}>
              <Typography tag="p" color={colors.red}>
                Failed to switch networks. Try switching the network in your
                wallet's settings.
              </Typography>
            </ErrorToast>
          ));
        }
        if (throwErrors) {
          throw error;
        }
      }
    },
    [
      connector,
      connectionsObj,
      config.envName,
      isMagicLoggedIn,
      switchChain,
      searchParams,
      setSearchParams,
      setEnvConfig,
      throwErrors
    ]
  );
}
