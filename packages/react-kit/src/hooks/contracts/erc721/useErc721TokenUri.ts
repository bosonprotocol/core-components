import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../core-sdk/useCoreSdkWithContext";

export const useErc721TokenUri = (
  props: {
    contractAddress: string | undefined;
    tokenIds: (string | null | undefined)[] | undefined;
  },
  { enabled }: { enabled: boolean | undefined }
) => {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["useErc721TokenUri", coreSDK.uuid, props],
    async () => {
      const { contractAddress, tokenIds } = props;
      if (!contractAddress || !tokenIds) {
        return;
      }
      return Promise.all(
        tokenIds.map((tokenId) =>
          tokenId
            ? coreSDK.erc721TokenUri({
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
