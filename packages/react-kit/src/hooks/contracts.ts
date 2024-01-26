import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";

export const useErc20Balance = (
  args: {
    contractAddress: string | undefined;
    owner: string | undefined;
  },
  options: { enabled?: boolean }
) => {
  const { contractAddress = "", owner = "" } = args;
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["erc-20-balance", coreSDK.uuid, args],
    async () => {
      if (!contractAddress || !owner) {
        return;
      }
      return coreSDK.erc20BalanceOf({
        contractAddress,
        owner
      });
    },
    {
      enabled: options.enabled
    }
  );
};
