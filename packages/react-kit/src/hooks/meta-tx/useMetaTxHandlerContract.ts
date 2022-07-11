import { useState, useEffect } from "react";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { contracts, Provider } from "@bosonprotocol/ethers-sdk";

import { useBiconomy, BiconomyConfig } from "./useBiconomy";
import { useSignerAddress } from "../useSignerAddress";

type MetaTxHandlerConfig = BiconomyConfig & {
  protocolDiamond?: string;
  web3Provider?: Provider;
};

export function useMetaTxHandlerContract(config: MetaTxHandlerConfig) {
  const defaultConfig = getDefaultConfig({ chainId: config.chainId });
  const [metaTxHandlerContract, setMetaTxHandlerContract] = useState<
    contracts.IBosonMetaTransactionsHandler | undefined
  >();
  const biconomyState = useBiconomy(config);
  const signerAddress = useSignerAddress(config.web3Provider);

  useEffect(() => {
    if (
      signerAddress &&
      biconomyState.status === "initialized" &&
      biconomyState.biconomy
    ) {
      setMetaTxHandlerContract(
        contracts.IBosonMetaTransactionsHandler__factory.connect(
          config.protocolDiamond || defaultConfig.contracts.protocolDiamond,
          biconomyState.biconomy.getSignerByAddress(signerAddress)
        )
      );
    }
  }, [
    signerAddress,
    biconomyState,
    config.protocolDiamond,
    defaultConfig.contracts.protocolDiamond
  ]);

  return metaTxHandlerContract;
}
