import { program } from "commander";
import { CID } from "multiformats/cid";
import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import { Readable } from "stream";

import { BaseIpfsStorage } from "../packages/ipfs-storage/src/ipfs/base";
import { EnvironmentType } from "../packages/common/src/types/configs";
import { getEnvConfigById, subgraph } from "../packages/core-sdk/src";
import { buildInfuraHeaders } from "./utils/infura";

import { getSubgraphSdk } from "../packages/core-sdk/src/utils/graphql";

const imageIpfsGatewayMap = {
  local: "https://test-permanent-fly-490.mypinata.cloud/ipfs/",
  testing: "https://test-permanent-fly-490.mypinata.cloud/ipfs/",
  staging: "https://test-permanent-fly-490.mypinata.cloud/ipfs/",
  production: "https://gray-permanent-fly-490.mypinata.cloud/ipfs/"
} as const;

const getExtractCID =
  (offerId: string) => (imageUri: string, origin: string) => {
    const cidFromUri = imageUri.replaceAll("ipfs://", "");

    try {
      CID.parse(cidFromUri);
      return cidFromUri;
    } catch (error) {
      // if fails to parse, we assume it could be a gateway url
      const cidFromUrl = imageUri.split("/").at(-1);

      try {
        CID.parse(cidFromUrl || imageUri);
        return cidFromUrl;
      } catch (error) {
        console.error(
          `Failed to parse CID from: ${imageUri} (id=${offerId}, ${origin})`
        );
        return undefined;
      }
    }
  };

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  // hack from https://github.com/PinataCloud/Pinata-SDK/issues/28#issuecomment-816439078
  (stream as any).path = `${Date.now()}.png`;

  return stream;
}

function makeFetchPinataApi(maxRetries = 1) {
  let retries = 0;
  async function fetchPinataApi(request: AxiosRequestConfig) {
    try {
      const response = await axios(request);
      return response;
    } catch (error) {
      if (retries <= maxRetries) {
        // if rate limit hit, then wait a minute and retry
        if (error?.response?.status === 429) {
          console.log("Rate limit hit. Retrying after 60 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 60_000));
          retries++;
          return fetchPinataApi(request);
        }
      }
      throw error;
    }
  }
  return fetchPinataApi;
}

program
  .description("Pin offer images to Pinata")
  .requiredOption("-p, --pinata <PINATA_JWT>")
  .requiredOption(
    "-i, --infura <INFURA_PROJECT_ID>/<INFURA_PROJECT_SECRET>",
    "ProjectId and Secret required to address Infura IPFS gateway"
  )
  .option(
    "-l, --list <OFFER_IDS>",
    "Comma-separated list of specific offer IDs to process."
  )
  .option(
    "-fd, --from-date <CREATED_FROM>",
    "Start timestamp in milliseconds of offer creation. Can be used to only process a subset of offer images."
  )
  .option(
    "-td, --to-date <CREATED_TO>",
    "End timestamp in milliseconds of offer creation. Can be used to only process a subset of offer images."
  )
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

async function main() {
  const {
    pinata,
    env: envName,
    infura,
    fromDate,
    toDate,
    list,
    configId = "testing-80002-0"
  } = program.opts();
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const ipfsStorage = new BaseIpfsStorage({
    url: defaultConfig.ipfsMetadataUrl,
    headers: infura ? buildInfuraHeaders(infura) : undefined
  });

  const fromTimestampMS = parseInt(fromDate || 0);
  if (isNaN(fromTimestampMS)) {
    throw new Error(`Invalid value provided to --from-date option`);
  }
  const fromTimestampSec = Math.floor(
    new Date(fromTimestampMS).getTime() / 1000
  ).toString();

  const toTimestampMS = parseInt(toDate || Date.now());
  if (isNaN(toTimestampMS)) {
    throw new Error(`Invalid value provided to --to-date option`);
  }
  const toTimestampSec = Math.floor(
    new Date(toTimestampMS).getTime() / 1000
  ).toString();

  const subgraphUrl = defaultConfig.subgraphUrl;
  if (!subgraphUrl) {
    console.log("Subgraph is not set for this environment. Aborting...");
    return;
  }
  const first = 100;
  let page = 0;
  let doMoreOffersExist = true;

  console.log(
    "\n1. Fetching offers to process...",
    "\n\t\tsubgraphUrl",
    subgraphUrl
  );
  const subgraphSdk = getSubgraphSdk(subgraphUrl);
  let offersToProcess: Awaited<
    ReturnType<typeof subgraphSdk.getOffersMediaQuery>
  >["offers"] = [];
  // const withWrapper = defaultWrapper;
  while (doMoreOffersExist) {
    const queryVars = {
      offersFirst: first,
      offersSkip: page * first,
      offersOrderDirection: subgraph.OrderDirection.ASC,
      offersOrderBy: subgraph.Offer_OrderBy.CREATEDAT,
      offersFilter: {
        disputeResolverId: defaultConfig.defaultDisputeResolverId,
        id_in: list ? list.split(",") : undefined,
        createdAt_gte: fromTimestampSec,
        createdAt_lte: toTimestampSec
      }
    };
    const { offers: paginatedOffers } =
      await subgraphSdk.getOffersMediaQuery(queryVars);

    offersToProcess = [...offersToProcess, ...paginatedOffers];

    if (paginatedOffers.length < first) {
      doMoreOffersExist = false;
    } else {
      page++;
    }
  }
  console.log(`Fetched ${offersToProcess.length} offers to process`);

  console.log("\n2. Extracting CIDs from offers...");
  const cidToMetadataMap = new Map<
    string,
    { offerId: string; isVideo?: boolean }
  >();
  const uniqueCIDs = new Set(
    offersToProcess.flatMap((offer) => {
      let cids: string[] = [];

      try {
        // Populate __typename to make TypeScript happy
        if (offer.metadata) {
          if (offer.metadata.type === "PRODUCT_V1") {
            offer.metadata.__typename = "ProductV1MetadataEntity";
          } else if (offer.metadata.type === "BASE") {
            offer.metadata.__typename = "BaseMetadataEntity";
          }
        }
        const offerId = offer.id;
        const extractCID = getExtractCID(offerId);
        if (offer.metadata?.__typename === "ProductV1MetadataEntity") {
          const metadataImage = offer.metadata.image
            ? [extractCID(offer.metadata.image, "offer.metadata.image")]
            : [];
          const metadataAnimation = offer.metadata.animationUrl
            ? [
                extractCID(
                  offer.metadata.animationUrl,
                  "offer.metadata.animationUrl"
                )
              ]
            : [];
          const visualImages = offer.metadata.product.visuals_images.map(
            (img, index) =>
              extractCID(
                img.url,
                `offer.metadata.product.visuals_images[${index}]`
              )
          );
          const visualVideos =
            offer.metadata.product.visuals_videos?.map((vid, index) =>
              extractCID(
                vid.url,
                `offer.metadata.product.visuals_videos[${index}]`
              )
            ) || [];
          const sellerImages =
            offer.metadata?.productV1Seller?.images?.map((img, index) =>
              extractCID(
                img.url,
                `offer.metadata?.productV1Seller?.images[${index}]`
              )
            ) || [];
          const videoCIDs = [...metadataAnimation, ...visualVideos].filter(
            (v) => !!v
          );
          const imageCIDs = [
            ...metadataImage,
            ...visualImages,
            ...sellerImages
          ].filter((v) => !!v);

          // save some metadata for later usage
          for (const videoCID of videoCIDs) {
            cidToMetadataMap.set(videoCID, {
              offerId: offer.id,
              isVideo: true
            });
          }
          for (const imageCID of imageCIDs) {
            cidToMetadataMap.set(imageCID, {
              offerId: offer.id
            });
          }

          cids = [...imageCIDs, ...videoCIDs];
        } else if (offer.metadata?.__typename === "BaseMetadataEntity") {
          const metadataImage = offer.metadata.image
            ? [extractCID(offer.metadata.image, "offer.metadata.image")]
            : [];
          cids = metadataImage;
        }
      } catch (error) {
        console.warn(
          `Failed to extract image CIDs from offer with id: ${offer.id}`
        );
        console.warn(`> Error: ${error.message}`);
      }

      return cids;
    })
  );
  console.log(`Extracted ${uniqueCIDs.size} unique CIDs`);

  console.log("\n3. Pinning to Pinata...");
  const imageIpfsGateway =
    imageIpfsGatewayMap[envName] ||
    "https://api.pinata.cloud/data/pinList?includesCount=false&hashContains=";
  let successCount = 0;
  let skippedCount = 0;
  // Using naive sequential approach due to possible rate limiting.
  // TODO: Replace with batch approach
  for (const cid of uniqueCIDs) {
    try {
      // check if already pinned on Pinata
      const response = await makeFetchPinataApi()({
        method: "get",
        url: `${imageIpfsGateway}${cid}`,
        headers: {
          Authorization: `Bearer ${pinata}`
        }
      });
      if (response.data) {
        skippedCount++;
        console.log(`${cid} 📌 pinned already`);
        continue;
      }
    } catch (error) {
      console.log(
        `Failed to check ${cid}`,
        error?.response?.status || error.code || error.message
      );
    }

    const content: number[] = [];
    let fetchChunks = true;
    const maxChunkSize = 10485760;
    let read = 0;
    while (fetchChunks) {
      const fileChunks = ipfsStorage.ipfsClient.cat(cid, {
        offset: content.length,
        length: maxChunkSize
      });
      await (async () => {
        for await (const chunk of fileChunks) {
          content.push(...chunk);
        }
      })();
      fetchChunks = content.length > read;
      read = content.length;
    }

    const formData = new FormData();
    formData.append("file", bufferToStream(Buffer.from(content)));
    formData.append("pinataOptions", '{"cidVersion": 0}');

    try {
      await makeFetchPinataApi()({
        method: "post",
        maxBodyLength: 104857600, //100mb
        maxContentLength: 104857600, //100mb
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        headers: {
          Authorization: `Bearer ${pinata}`,
          ...formData.getHeaders()
        },
        data: formData
      });
      console.log(`${cid} ✅`);
      successCount++;
    } catch (error) {
      console.log(
        `${cid} ❌`,
        error?.response?.status || error.code || error.message
      );
    }
  }
  console.log(
    `Finished pinning. Success: ${successCount}, skipped: ${skippedCount}, failed: ${
      uniqueCIDs.size - successCount - skippedCount
    }`
  );
}

main()
  .then(() => {
    console.log("\ndone");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
