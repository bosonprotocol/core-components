import { providers } from "ethers";
import { useSigner } from "wagmi";
import { hooks } from "..";
import { useEnvContext } from "../components/environment/EnvironmentContext";

export function useCoreSDKWithContext() {
  const { envName } = useEnvContext();
  const { data: signer } = useSigner();
  return hooks.useCoreSdk({
    envName,
    web3Provider: signer?.provider as providers.Web3Provider
  });
}
