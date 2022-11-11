import { program } from "commander";
import { CID } from "multiformats/cid";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

import { BaseIpfsStorage } from "../packages/ipfs-storage/src/ipfs/base";
import { EnvironmentType } from "../packages/common/src/types/configs";
import { getDefaultConfig, offers, subgraph } from "../packages/core-sdk/src";
import { buildInfuraHeaders } from "./utils/infura";

function extractCID(imageUri: string) {
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
      throw new Error(`Failed to parse CID from: ${imageUri}`);
    }
  }
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  // hack from https://github.com/PinataCloud/Pinata-SDK/issues/28#issuecomment-816439078
  (stream as any).path = `${Date.now()}.png`;

  return stream;
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
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .parse(process.argv);

async function main() {
  const { pinata, env: envName, infura, fromDate, list } = program.opts();
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
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

  const first = 100;
  let page = 0;
  let doMoreOffersExist = true;
  let offersToProcess: subgraph.OfferFieldsFragment[] = [];

  console.log("\n1. Fetching offers to process...");
  while (doMoreOffersExist) {
    const paginatedOffers = await offers.subgraph.getOffers(
      defaultConfig.subgraphUrl,
      {
        offersFirst: first,
        offersSkip: page * first,
        offersOrderDirection: subgraph.OrderDirection.Asc,
        offersOrderBy: subgraph.Offer_OrderBy.CreatedAt,
        offersFilter: {
          disputeResolverId: "3",
          id_in: list ? list.split(",") : undefined,
          createdAt_gte: fromTimestampSec
        }
      }
    );
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

        if (offer.metadata?.__typename === "ProductV1MetadataEntity") {
          const metadataImage = offer.metadata.image
            ? [extractCID(offer.metadata.image)]
            : [];
          const metadataAnimation = offer.metadata.animationUrl
            ? [extractCID(offer.metadata.animationUrl)]
            : [];
          const visualImages = offer.metadata.product.visuals_images.map(
            (img) => extractCID(img.url)
          );
          const visualVideos =
            offer.metadata.product.visuals_videos?.map((vid) =>
              extractCID(vid.url)
            ) || [];
          const sellerImages =
            offer.metadata?.productV1Seller?.images?.map((img) =>
              extractCID(img.url)
            ) || [];
          const videoCIDs = [...metadataAnimation, ...visualVideos];
          const imageCIDs = [
            ...metadataImage,
            ...visualImages,
            ...sellerImages
          ];

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
            ? [extractCID(offer.metadata.image)]
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
  let successCount = 0;
  // Using naive sequential approach due to possible rate limiting.
  // TODO: Replace with batch approach
  for (const cid of uniqueCIDs) {
    try {
      // check if already pinned on Pinata
      const response = await axios({
        method: "get",
        url: `https://api.pinata.cloud/data/pinList?includesCount=false&hashContains=${cid}`,
        headers: {
          Authorization: `Bearer ${pinata}`
        }
      });
      if (response.data) {
        console.log(`${cid} ✅ pinned already`);
        continue;
      }
    } catch (error) {
      console.log(
        `Failed to check ${cid}`,
        error?.response?.status || error.code || error.message
      );
    }

    const fileChunks = ipfsStorage.ipfsClient.cat(cid);

    let content: number[] = [];
    for await (const chunk of fileChunks) {
      content = [...content, ...chunk];
    }

    const formData = new FormData();
    formData.append("file", bufferToStream(Buffer.from(content)));
    formData.append("pinataOptions", '{"cidVersion": 0}');

    try {
      await axios({
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
    `Finished pinning. Success: ${successCount}, failed: ${
      uniqueCIDs.size - successCount
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
