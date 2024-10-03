import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useMutation } from "react-query";

export const useErc20EnsureAllowance = (
  filter: Parameters<CoreSDK["erc20EnsureAllowance"]>[0],
  { coreSDK }: { coreSDK: Pick<CoreSDK, "erc20EnsureAllowance"> }
) => {
  return useMutation(async () => {
    return await coreSDK.erc20EnsureAllowance(filter);
  });
};
