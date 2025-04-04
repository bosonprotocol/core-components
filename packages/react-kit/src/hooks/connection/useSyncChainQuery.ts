import { useWeb3React } from "@web3-react/core";
import { ParsedQs } from "qs";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { useDisconnect } from "./useDisconnect";
import { useAccount, useChainId } from "./connection";
import { getConfigsByChainId } from "../../lib/config/getConfigsByChainId";
import { useConfigContext } from "../../components/config/ConfigContext";
import useParsedQueryString from "../parameters/useParsedQueryString";
import { isSupportedChain } from "../../lib/const/chains";
import { useSelectChain } from "./useSelectChain";
import { configQueryParameters } from "../../lib/const/parameters";
import { useIsMagicLoggedIn } from "../magic";
import { ConfigId } from "@bosonprotocol/core-sdk";

function getParsedConfigId(parsedQs?: ParsedQs) {
  const configId = parsedQs?.configId;
  if (!configId || typeof configId !== "string") return;

  return configId;
}

export default function useSyncChainQuery() {
  const { isActive } = useWeb3React();
  const chainId = useChainId();
  const isMagicLoggedIn = useIsMagicLoggedIn();
  const { address: account } = useAccount();
  const { config } = useConfigContext();
  const _disconnect = useDisconnect();

  const currentConfigId = config.configId;
  const currentChainId = config.chainId;

  const parsedQs = useParsedQueryString();
  const configIdRef = useRef(currentConfigId);
  const accountRef = useRef(account);
  const accountAlreadyConnected = useRef<string | undefined>(account);
  const disconnect = useCallback(() => {
    accountAlreadyConnected.current = undefined;
    _disconnect({ isUserDisconnecting: false });
  }, [_disconnect]);
  useEffect(() => {
    if (!isActive || isMagicLoggedIn) {
      return;
    }
    const alreadyConnected = !!accountAlreadyConnected.current;
    if (alreadyConnected) {
      if (account && chainId !== currentChainId) {
        if (isSupportedChain({ chainId, envName: config.envName })) {
          // connected account to a different supported chain ${chainId} ${currentChainId}
          const configIdFromChainId = getConfigsByChainId(
            chainId,
            config.envName
          )?.[0].configId;
          selectChain(configIdFromChainId);

          if (configIdFromChainId) {
            searchParams.set(
              configQueryParameters.configId,
              configIdFromChainId
            );
            setSearchParams(searchParams);
            configIdRef.current = configIdFromChainId;
          }
        } else {
          // connected account to an unsupported chain ${chainId}
          disconnect();
        }
      }
    } else {
      // connecting

      if (!isSupportedChain({ chainId, envName: config.envName })) {
        // connecting account to an unsupported chain ${chainId}
        const configIdToConnect = (urlConfigId || currentConfigId) as ConfigId;
        selectChain(configIdToConnect);

        if (configIdToConnect) {
          searchParams.set(configQueryParameters.configId, configIdToConnect);
          setSearchParams(searchParams);
          configIdRef.current = configIdToConnect;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, isActive, isMagicLoggedIn]);
  useEffect(() => {
    if (account && account !== accountRef.current) {
      configIdRef.current = currentConfigId;
      accountRef.current = account;
    }
  }, [account, currentConfigId]);
  useEffect(() => {
    if (
      isActive &&
      account &&
      account !== accountAlreadyConnected.current &&
      !accountAlreadyConnected.current
    ) {
      accountAlreadyConnected.current = account;
    }
  }, [account, isActive]);

  const urlConfigId = getParsedConfigId(parsedQs);

  const selectChain = useSelectChain({ doConnect: true, throwErrors: false });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // if the connected chainId does not match the query param configId, change the user's chain on pageload
    if (
      ((isActive && !account) || isMagicLoggedIn) &&
      urlConfigId &&
      configIdRef.current === currentConfigId &&
      currentConfigId !== urlConfigId
    ) {
      selectChain(urlConfigId as ConfigId);
    }
    // If a user has a connected wallet and has manually changed their chain, update the query parameter if it's supported
    else if (
      account &&
      configIdRef.current !== currentConfigId &&
      currentConfigId !== urlConfigId
    ) {
      if (isSupportedChain({ chainId, envName: config.envName })) {
        searchParams.set(configQueryParameters.configId, currentConfigId);
      } else {
        searchParams.delete(configQueryParameters.configId);
        disconnect();
      }
      setSearchParams(searchParams);
    }
    // If a user has a connected wallet and the currentConfigId matches the query param chain, update the configIdRef
    else if (
      isActive &&
      currentConfigId === urlConfigId &&
      configIdRef.current !== urlConfigId
    ) {
      configIdRef.current = urlConfigId;
    }
  }, [
    currentConfigId,
    urlConfigId,
    selectChain,
    searchParams,
    isActive,
    chainId,
    account,
    setSearchParams,
    disconnect,
    currentChainId,
    isMagicLoggedIn,
    config.envName
  ]);
}
