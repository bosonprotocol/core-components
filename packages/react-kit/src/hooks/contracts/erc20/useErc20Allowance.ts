import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc20Allowance = (
  args: {
    contractAddress: string | undefined;
    owner: string | undefined;
    spender: string | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  const { contractAddress = "", owner = "", spender = "" } = args;
  return useQuery(
    ["erc-20-allowance", coreSDK.uuid, args],
    async () => {
      if (!contractAddress || !owner || !spender) {
        return;
      }
      return coreSDK.erc20GetAllowance({
        contractAddress,
        owner,
        spender
      });
    },
    {
      enabled
    }
  );
};
