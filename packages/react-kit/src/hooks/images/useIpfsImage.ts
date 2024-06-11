import { useQuery } from "react-query";
import { fetchImageAsBase64 } from "../../lib/base64/base64";
import { getImageMetadata } from "../../lib/images/images";

type UseIpfsImageProps = {
  url: string;
};

export function useIpfsImage(
  { url }: UseIpfsImageProps,
  options: { enabled: boolean }
) {
  return useQuery(
    ["useIpfsImage", url],
    async () => {
      const result = await fetchImageAsBase64(url);
      const metadata = await getImageMetadata(result.base64);
      return {
        ...result,
        ...metadata
      };
    },
    {
      enabled: options.enabled
    }
  );
}
