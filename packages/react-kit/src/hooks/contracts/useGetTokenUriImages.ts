import { getImageUrl } from "../../lib/images/images";
import { useQuery } from "react-query";

const replaceUrlWithId = ({
  tokenId,
  url
}: {
  url: string;
  tokenId: string;
}) => {
  const urlWithIdReplaced = url.replace("{id}", tokenId);
  return urlWithIdReplaced;
};

export const useGetTokenUriImages = (
  props: {
    pairsTokenUrisIds:
      | ({
          tokenUris: (string | null | undefined)[] | undefined | null;
          tokenIds: (string | null | undefined)[] | undefined | null;
        } | null)[]
      | undefined;

    ipfsGateway?: string;
  },
  { enabled }: { enabled: boolean }
) => {
  const { pairsTokenUrisIds, ipfsGateway = "https://ipfs.io/ipfs" } = props;
  return useQuery(
    ["useGetTokenUriImages", props],
    async () => {
      if (!pairsTokenUrisIds) {
        return [];
      }
      try {
        return await Promise.all(
          pairsTokenUrisIds.map(async (pair): Promise<string[]> => {
            if (!pair) {
              return Promise.resolve([]);
            }
            const { tokenIds, tokenUris } = pair;
            if (
              !tokenIds ||
              !tokenUris ||
              tokenUris.length !== tokenIds.length
            ) {
              return Promise.resolve([]);
            }
            return await Promise.all(
              tokenUris.map(async (tokenUri, index): Promise<string> => {
                const tokenId = tokenIds[index];
                if (!tokenUri || !tokenId) {
                  return "";
                }
                if (tokenUri.startsWith("data:application/json")) {
                  const base64Data = tokenUri.substring(
                    tokenUri.indexOf(",") + 1
                  );
                  const jsonValue = window.atob(base64Data);
                  const parsedJson = JSON.parse(jsonValue);
                  const image = parsedJson.image;
                  const imageUrl = getImageUrl(image, ipfsGateway);
                  const urlWithIdReplaced = replaceUrlWithId({
                    url: imageUrl,
                    tokenId
                  });
                  return urlWithIdReplaced;
                }
                if (tokenUri.startsWith("ipfs")) {
                  const imageUrl = getImageUrl(tokenUri, ipfsGateway);
                  const urlWithIdReplaced = replaceUrlWithId({
                    url: imageUrl,
                    tokenId
                  });

                  const fetchedMetadata = await fetch(urlWithIdReplaced);
                  try {
                    const jsonMetadata = await fetchedMetadata.json();
                    const imageUrl = getImageUrl(
                      jsonMetadata.image,
                      ipfsGateway
                    );
                    return imageUrl;
                  } catch (error) {
                    console.debug(error);
                  }

                  return urlWithIdReplaced;
                }
                if (tokenUri.startsWith("http")) {
                  const urlWithIdReplaced = replaceUrlWithId({
                    url: tokenUri,
                    tokenId
                  });
                  const fetchedMetadata = await fetch(urlWithIdReplaced);
                  try {
                    const jsonMetadata = await fetchedMetadata.json();
                    const image = jsonMetadata.image;
                    const imageUrl = getImageUrl(image, ipfsGateway);
                    return imageUrl;
                  } catch (error) {
                    console.debug(error);
                  }

                  return urlWithIdReplaced;
                }

                if (tokenUri.startsWith("data:image")) {
                  return tokenUri;
                }

                return "";
              })
            );
          })
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    {
      enabled
    }
  );
};
