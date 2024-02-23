import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useSignerAddress } from "./useSignerAddress";

export function useMetaTx(coreSdk: CoreSDK | undefined) {
  const { signerAddress, signerContract } = useSignerAddress(coreSdk?.web3Lib);
  const isMetaTx = coreSdk
    ? Boolean(coreSdk.isMetaTxConfigSet && signerAddress && !signerContract)
    : false;
  return { isMetaTx, signerAddress, signerContract };
}
