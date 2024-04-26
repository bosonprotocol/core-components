import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc721TokenUris = (
  props: {
    pairsContractTokens:
      | ({
          contractAddress: string | undefined | null;
          tokenIds: (string | null | undefined)[] | undefined;
        } | null)[]
      | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  return useQuery(
    ["useErc721TokenUris", coreSDK.uuid, props],
    async () => {
      const { pairsContractTokens } = props;
      if (!pairsContractTokens) {
        return;
      }

      return (
        await Promise.all(
          pairsContractTokens.map(async (pair) =>
            pair && pair.contractAddress && pair.tokenIds
              ? await Promise.allSettled(
                  pair.tokenIds.map((tokenId) =>
                    tokenId && pair.contractAddress
                      ? coreSDK.erc721TokenUri({
                          contractAddress: pair.contractAddress,
                          tokenId
                        })
                      : null
                  )
                )
              : null
          )
        )
      ).map((promiseSettled) =>
        promiseSettled
          ? promiseSettled.map((promiseSettled) =>
              promiseSettled.status === "fulfilled"
                ? promiseSettled.value
                : null
            )
          : null
      );
    },
    { enabled }
  );
};
