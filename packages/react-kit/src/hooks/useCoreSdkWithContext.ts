import { providers } from "ethers";
import { hooks } from "..";
import { useEnvContext } from "../components/environment/EnvironmentContext";
import { useEthersSigner } from "./ethers/useEthersSigner";

export function useCoreSDKWithContext() {
  const { envName } = useEnvContext();
  const signer = useEthersSigner();
  return hooks.useCoreSdk({
    envName,
    web3Provider: signer?.provider as providers.Web3Provider
  });
}
