import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useSignerAddress } from "./useSignerAddress";

export function useMetaTx(
  coreSdk: Pick<CoreSDK, "isMetaTxConfigSet" | "web3Lib"> | undefined
) {
  const { signerAddress, signerContract } = useSignerAddress(coreSdk?.web3Lib);
  const isMetaTx = coreSdk
    ? Boolean(coreSdk.isMetaTxConfigSet && signerAddress && !signerContract)
    : false;
  return { isMetaTx, signerAddress, signerContract };
}
