import { CoreSDK } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

export const useErc1155Name = (
  props: {
    contractAddresses: (string | null | undefined)[] | undefined;
  },
  { enabled, coreSDK }: { enabled: boolean | undefined; coreSDK: CoreSDK }
) => {
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
