import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";
import { getImageUrl } from "../../lib/images/images";
import { useQuery } from "react-query";

const decodeDataURIContent = (result: parseDataURL.DataURL) => {
  const encodingName =
    labelToName(result.mimeType.parameters.get("charset") || "utf-8") ||
    "utf-8";
  const bodyDecoded = decode(result.body, encodingName);
  return bodyDecoded;
};

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

export type UseGetTokenUriImageArg0 = {
  tokenUri: string | undefined | null;
  ipfsGateway?: string;
  tokenId: string | undefined | null;
};
export const useGetTokenUriImage = (
  props: {
    tokenUri: string | undefined | null;
    ipfsGateway?: string;
    tokenId: string | undefined | null;
  },
  { enabled }: { enabled: boolean }
) => {
  const { tokenUri, ipfsGateway = "https://ipfs.io/ipfs", tokenId } = props;
  return useQuery(
    ["useGetTokenUriImage", props],
    async () => {
      if (!tokenUri || !tokenId) {
        return "";
      }
      try {
        if (tokenUri.toLowerCase().includes("json")) {
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
          return urlWithIdReplaced;
        }
        const result = parseDataURL(tokenUri);
        if (!result) {
          return "";
        }
        const { essence } = result.mimeType;
        if (essence.startsWith("image")) {
          return decodeDataURIContent(result);
        }

        return "";
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

/*

JSON.parse(
            window.atob(
              erc721TokenUri[0].substring(erc721TokenUri[0].indexOf(",") + 1)
            )
          ).image

*/
