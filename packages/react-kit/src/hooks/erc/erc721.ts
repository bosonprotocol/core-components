import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../useCoreSdkWithContext";

export const useErc721OwnerOf = (
  {
    contractAddress,
    tokenIds
  }: {
    contractAddress: string | undefined;
    tokenIds: (string | null | undefined)[] | undefined;
  },
  { enabled }: { enabled: boolean | undefined }
) => {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(["erc721-owner-of", coreSDK.uuid], () => {
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
  });
};
