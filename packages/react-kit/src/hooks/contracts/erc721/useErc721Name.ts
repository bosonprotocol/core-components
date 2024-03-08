import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc721Name = (
  props: {
    contractAddresses: (string | null | undefined)[] | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
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
