import { createMulticall, ListenerOptions } from "@uniswap/redux-multicall";
import { ChainId } from "@uniswap/sdk-core";
import React, { useMemo } from "react";
import { useChainId } from "../../hooks/connection/connection";
import {
  useBlockNumber,
  useMainnetBlockNumber
} from "../../hooks/contracts/useBlockNumber";
import {
  useInterfaceMulticall,
  useMainnetInterfaceMulticall
} from "../../hooks/contracts/useContract";

export const multicall = createMulticall();

export default multicall;

/**
 *
 * @param chainId -
 * @returns The approximate whole number of blocks written to the corresponding chainId per Ethereum mainnet epoch.
 */
function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  // TODO(WEB-2437): See if these numbers need to be updated
  switch (chainId) {
    case ChainId.ARBITRUM_ONE:
    case ChainId.OPTIMISM:
      return 15;
    case ChainId.AVALANCHE:
    case ChainId.BNB:
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return 5;
    default:
      return 1;
  }
}

export function MulticallUpdater() {
  const chainId = useChainId();
  const latestBlockNumber = useBlockNumber();
  const latestMainnetBlockNumber = useMainnetBlockNumber();
  const contract = useInterfaceMulticall();
  const mainnetContract = useMainnetInterfaceMulticall();
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId)
    }),
    [chainId]
  );
  const mainnetListener: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(ChainId.MAINNET)
    }),
    []
  );

  return (
    <>
      <multicall.Updater
        chainId={ChainId.MAINNET}
        latestBlockNumber={latestMainnetBlockNumber}
        contract={mainnetContract}
        listenerOptions={mainnetListener}
      />
      {chainId !== ChainId.MAINNET && (
        <multicall.Updater
          chainId={chainId}
          latestBlockNumber={latestBlockNumber}
          contract={contract}
          listenerOptions={listenerOptions}
        />
      )}
    </>
  );
}
