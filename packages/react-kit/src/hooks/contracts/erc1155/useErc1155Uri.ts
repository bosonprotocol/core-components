import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../core-sdk/useCoreSdkWithContext";

export const useErc1155Uri = (
  props: {
    contractAddress: string | undefined;
    tokenIds: (string | null | undefined)[] | undefined;
  },
  { enabled }: { enabled: boolean | undefined }
) => {
  const coreSDK = useCoreSDKWithContext();
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
