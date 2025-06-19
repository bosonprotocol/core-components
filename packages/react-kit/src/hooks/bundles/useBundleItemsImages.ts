import { CoreSDK, subgraph } from "@bosonprotocol/core-sdk";
import { isNftItem, isTruthy } from "@bosonprotocol/utils";
import { useErc721TokenUris } from "../contracts/erc721/useErc721TokenUris";
import { useErc1155Uris } from "../contracts/erc1155/useErc1155Uris";
import { useGetTokenUriImages } from "../contracts/useGetTokenUriImages";

export const useBundleItemsImages = ({
  bundleItems,
  coreSDK
}: {
  bundleItems:
    | Extract<
        subgraph.OfferFieldsFragment["metadata"],
        { __typename: "BundleMetadataEntity" }
      >["items"]
    | undefined;
  coreSDK: CoreSDK;
}) => {
  const pairsContractTokens = bundleItems?.map((bundleItem) =>
    isNftItem(bundleItem)
      ? {
          contractAddress: bundleItem.contract,
          tokenIds: [
            bundleItem.tokenId ||
              bundleItem.tokenIdRange?.min ||
              bundleItem.tokenIdRange?.max
          ]
        }
      : null
  );
  const { data: erc721TokenUris } = useErc721TokenUris(
    {
      pairsContractTokens
    },
    {
      enabled: !!pairsContractTokens?.length,
      coreSDK
    }
  );
  const { data: erc1155Uris } = useErc1155Uris(
    {
      pairsContractTokens
    },
    {
      enabled: !!pairsContractTokens?.length,
      coreSDK
    }
  );
  const { data: ercImages } = useGetTokenUriImages(
    {
      pairsTokenUrisIds: pairsContractTokens?.map((pair, index) => {
        return {
          tokenIds: pair?.tokenIds,
          tokenUris: erc721TokenUris?.[index]?.filter(isTruthy).length
            ? erc721TokenUris?.[index]
            : erc1155Uris?.[index]
        };
      })
    },
    { enabled: !!pairsContractTokens?.length }
  );
  const images = bundleItems?.map((bundleItem, index) => {
    const img = ercImages?.[index][0] || ""; // image of first tokenId
    if (isNftItem(bundleItem)) {
      return img || bundleItem.image;
    }
    return img;
  });
  return { images };
};
