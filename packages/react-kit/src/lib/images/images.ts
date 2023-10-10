import { blobToBase64 } from "../base64/base64";
import { getIpfsGatewayUrl } from "../ipfs/ipfs";

// See https://docs.pinata.cloud/gateways/image-optimization
export type ImageOptimizationOpts = {
  width: number;
  height: number;
  dpr: number;
  fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
  gravity: "auto" | "side" | "XxY";
  quality: number;
  format: "auto";
  anim: boolean;
  sharpen: number;
};

export function getImageUrl(
  uri: string,
  gateway: string,
  optimizationOpts: Partial<ImageOptimizationOpts> = {}
) {
  if (uri.startsWith("data:")) {
    return uri;
  }
  const ipfsGatewayUrl = getIpfsGatewayUrl(uri, { gateway });
  return `${ipfsGatewayUrl}?${optsToQueryParams(optimizationOpts)}`;
}

export function getLensImageUrl(uri: string, ipfsGateway: string) {
  return getIpfsGatewayUrl(uri, { gateway: ipfsGateway });
}

export function getFallbackImageUrl(
  uri: string,
  ipfsGateway: string,
  opts?: Partial<ImageOptimizationOpts>
) {
  return getImageUrl(uri, ipfsGateway, {
    ...opts
  });
}

function optsToQueryParams(opts: Partial<ImageOptimizationOpts> = {}) {
  const transformedOpts = Object.keys(opts).reduce(
    (transformed, oldKey) => {
      return {
        ...transformed,
        [`img-${oldKey}`]: opts[oldKey as keyof ImageOptimizationOpts]
      };
    },
    {
      "img-format": "auto"
    }
  );
  return new URLSearchParams(transformedOpts).toString();
}

type ImageMetadata = {
  width: number;
  height: number;
};
export function getImageMetadata(image: File): Promise<ImageMetadata>;
export function getImageMetadata(image: string): Promise<ImageMetadata>;
export function getImageMetadata(image: File | string): Promise<ImageMetadata> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<ImageMetadata>(async (resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      });
    };
    img.onerror = (...errorArgs) => {
      reject(errorArgs);
    };
    if (typeof image === "string") {
      img.src = image;
    } else {
      const base64 = await blobToBase64(image);
      img.src = base64;
    }
  });
}
