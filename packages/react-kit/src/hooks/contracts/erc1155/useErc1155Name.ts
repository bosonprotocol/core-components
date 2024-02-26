import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../core-sdk/useCoreSdkWithContext";

export const useErc1155Name = (
  props: {
    contractAddresses: (string | null | undefined)[] | undefined;
  },
  { enabled }: { enabled: boolean | undefined }
) => {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["useErc1155Name", coreSDK.uuid, props],
    async () => {
      const { contractAddresses } = props;
      if (!contractAddresses) {
        return;
      }
      return Promise.all(
        contractAddresses.map((contractAddress) =>
          contractAddress
            ? coreSDK.erc1155Name({
                contractAddress
              })
            : null
        )
      );
    },
    { enabled }
  );
};
