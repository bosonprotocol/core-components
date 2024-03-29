import { CID } from "multiformats/cid";
import { sanitizeUrl } from "../url/url";

export function getIpfsGatewayUrl(
  uri: string,
  opts: {
    gateway: string;
  }
): string {
  if (!uri) {
    return uri;
  }
  const { gateway } = opts;
  const cidAndRest = uri.replaceAll("ipfs://", ""); // it may be ipfs://CID/123

  try {
    const [cid] = cidAndRest.split("/", 1); // it may be CID/123
    CID.parse(cid);
    return `${gateway}/${cidAndRest}`.replace(/([^:]\/)\/+/g, "$1"); // remove double slash
  } catch (error) {
    // If CID.parse throws, then it is either not a valid CID or just an URL
    const cidFromUrl = uri.split("/ipfs/")[1];
    if (cidFromUrl) {
      return getIpfsGatewayUrl(cidFromUrl.split("?")[0], opts);
    }

    return sanitizeUrl(uri);
  }
}
