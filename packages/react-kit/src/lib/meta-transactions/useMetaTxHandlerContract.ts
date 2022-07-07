import { useState, useEffect } from "react";
import { useBiconomy } from "./useBiconomy";
import { hooks } from "../connectors/metamask";
import { getConfig } from "../config";
import { contracts } from "@bosonprotocol/ethers-sdk";

export function useMetaTxHandlerContract() {
  const config = getConfig();
  const [metaTxHandlerContract, setMetaTxHandlerContract] = useState<
    contracts.IBosonMetaTransactionsHandler | undefined
  >();
  const account = hooks.useAccount();
  const biconomyState = useBiconomy();

  useEffect(() => {
    if (
      account &&
      biconomyState.status === "initialized" &&
      biconomyState.biconomy
    ) {
      setMetaTxHandlerContract(
        contracts.IBosonMetaTransactionsHandler__factory.connect(
          config.protocolDiamond,
          biconomyState.biconomy.getSignerByAddress(account)
        )
      );
    }
  }, [account, biconomyState, config.protocolDiamond]);

  return metaTxHandlerContract;
}
