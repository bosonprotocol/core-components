import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc20ExchangeTokenInfo = (
  args: {
    contractAddress: string | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  const { contractAddress = "" } = args;
  return useQuery(
    ["useErc20ExchangeTokenInfo", coreSDK.uuid, args],
    async () => {
      if (!contractAddress) {
        return;
      }
      return coreSDK.getExchangeTokenInfo(contractAddress);
    },
    {
      enabled
    }
  );
};
