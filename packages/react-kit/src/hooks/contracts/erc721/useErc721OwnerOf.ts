import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc721OwnerOf = (
  props: {
    contractAddress: string | undefined;
    tokenIds: (string | null | undefined)[] | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  return useQuery(
    ["erc721-owner-of", coreSDK.uuid, props],
    async () => {
      const { contractAddress, tokenIds } = props;
      if (!contractAddress || !tokenIds) {
        return;
      }
      return Promise.all(
        tokenIds.map((tokenId) =>
          tokenId
            ? coreSDK.erc721OwnerOf({
                contractAddress,
                tokenId
              })
            : null
        )
      );
    },
    {
      enabled
    }
  );
};
