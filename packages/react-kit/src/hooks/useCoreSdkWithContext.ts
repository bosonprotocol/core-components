import { providers } from "ethers";
import { getEnvConfigById, hooks } from "..";
import { useEnvContext } from "../components/environment/EnvironmentContext";
import { Token } from "../components/widgets/finance/convertion-rate/ConvertionRateContext";
import { useSigner } from "./connection/connection";

export function useCoreSDKWithContext() {
  const { envName, configId, metaTx } = useEnvContext();
  const signer = useSigner();
  const defaultConfig = getEnvConfigById(envName, configId);

  return hooks.useCoreSdk({
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
  });
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
