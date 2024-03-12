import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc1155Uri = (
  props: {
    contractAddress: string | undefined;
    tokenIds: (string | null | undefined)[] | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
  return useQuery(
    ["useErc1155Uri", coreSDK.uuid, props],
    async () => {
      const { contractAddress, tokenIds } = props;
      if (!contractAddress || !tokenIds) {
        return;
      }
      return Promise.all(
        tokenIds.map((tokenId) =>
          tokenId
            ? coreSDK.erc1155Uri({
                contractAddress,
                tokenId
              })
            : null
        )
      );
    },
    { enabled }
  );
};
