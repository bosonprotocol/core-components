import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../core-sdk/useCoreSdkWithContext";

export const useErc20ExchangeTokenInfo = (
  args: {
    contractAddress: string | undefined;
  },
  options: { enabled?: boolean }
) => {
  const { contractAddress = "" } = args;
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["useErc20ExchangeTokenInfo", coreSDK.uuid, args],
    async () => {
      if (!contractAddress) {
        return;
      }
      return coreSDK.getExchangeTokenInfo(contractAddress);
    },
    {
      enabled: options.enabled
    }
  );
};
