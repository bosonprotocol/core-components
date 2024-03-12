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

export const useGetTokenUriImage = (
  props: {
    tokenUris: (string | null | undefined)[] | undefined | null;
    ipfsGateway?: string;
    tokenIds: (string | null | undefined)[] | undefined | null;
  },
  { enabled }: { enabled: boolean }
) => {
  const { tokenUris, ipfsGateway = "https://ipfs.io/ipfs", tokenIds } = props;
  return useQuery(
    ["useGetTokenUriImage", props],
    async () => {
      if (!tokenUris || !tokenIds || tokenUris.length !== tokenIds.length) {
        return [];
      }
      try {
        return Promise.all(
          tokenUris.map(async (tokenUri, index) => {
            const tokenId = tokenIds[index];
            if (!tokenUri || !tokenId) {
              return "";
            }
            if (tokenUri.startsWith("data:application/json")) {
              const base64Data = tokenUri.substring(tokenUri.indexOf(",") + 1);
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
                const image = jsonMetadata.image;
                const imageUrl = getImageUrl(image, ipfsGateway);
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
