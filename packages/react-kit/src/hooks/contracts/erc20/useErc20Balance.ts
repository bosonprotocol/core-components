import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc20Balance = (
  args: {
    contractAddress: string | undefined;
    owner: string | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  const { contractAddress = "", owner = "" } = args;
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
      enabled
    }
  );
};
