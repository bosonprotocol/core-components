import { providers } from "ethers";
import { getEnvConfigById } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useEnvContext } from "../../components/environment/EnvironmentContext";
import { Token } from "../../components/widgets/finance/convertion-rate/ConvertionRateContext";
import { useSigner } from "../connection/connection";
import { useMemo } from "react";
import { useExternalSigner } from "../../components/signer/useExternalSigner";
import { hooks } from "../..";

export function useCoreSDKWithContext(): CoreSDK {
  const { envName, configId, metaTx } = useEnvContext();
  const externalSigner = useExternalSigner();
  const signer = useSigner();
  const defaultConfig = getEnvConfigById(envName, configId);
  const overrides = useMemo(() => {
    return externalSigner
      ? { web3Lib: externalSigner.externalWeb3LibAdapter }
      : undefined;
  }, [externalSigner]);
  return hooks.useCoreSdk(
    {
      envName,
      configId,
      web3Provider: signer?.provider as providers.Web3Provider,
      metaTx: {
        ...defaultConfig.metaTx,
        apiKey: metaTx?.apiKey,
        apiIds: getMetaTxApiIds(
          defaultConfig.contracts.protocolDiamond,
          defaultConfig.defaultTokens || [],
          metaTx?.apiIds
        )
      }
    },
    overrides
  );
}

function getMetaTxApiIds(
  protocolAddress: string,
  tokens: Token[],
  metaTxApiIds: string | undefined
) {
  const apiIds: Record<string, Record<string, string>> = {};
  try {
    const apiIdsInput = JSON.parse(metaTxApiIds || "[]");
    const method = "executeMetaTransaction"; // At the moment, both protocol and tokens have the same method
    Object.keys(apiIdsInput).forEach((key) => {
      if (key.toLowerCase() === "protocol") {
        apiIds[protocolAddress.toLowerCase()] = {};
        apiIds[protocolAddress.toLowerCase()][method] = apiIdsInput[key];
      } else {
        const token = tokens.find(
          (t: Token) => t.symbol.toLowerCase() === key.toLowerCase()
        );
        if (token) {
          apiIds[token.address.toLowerCase()] = {};
          apiIds[token.address.toLowerCase()][method] = apiIdsInput[key];
        } else {
          console.error(`Unable to resolve token with symbol ${key}`);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
  return apiIds;
}
