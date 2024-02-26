import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../core-sdk/useCoreSdkWithContext";

export const useErc721Name = (
  props: {
    contractAddresses: (string | null | undefined)[] | undefined;
  },
  { enabled }: { enabled: boolean | undefined }
) => {
  const coreSDK = useCoreSDKWithContext();
  return useQuery(
    ["useErc721Name", coreSDK.uuid, props],
    async () => {
      const { contractAddresses } = props;
      if (!contractAddresses) {
        return;
      }
      return Promise.all(
        contractAddresses.map((contractAddress) =>
          contractAddress
            ? coreSDK.erc721Name({
                contractAddress
              })
            : null
        )
      );
    },
    { enabled }
  );
};
