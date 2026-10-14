import { Command } from "commander";
import { buildReadOnlyCoreSDK, getEnvName, getConfigId } from "../utils";
import { getEnvConfigById } from "@bosonprotocol/core-sdk";
import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { BaseIpfsStorage } from "@bosonprotocol/ipfs-storage";
import { buildInfuraHeaders } from "../utils/infura";

export const exploreOfferCommand = new Command("explore-offer")
  .description(
    "Explore an on-chain Offer: retrieve offer data, token info, IPFS metadata and reserved range."
  )
  .argument(
    "<offerId>",
    "Id of the Offer to explore. Can also be set via OFFER_ID env var."
  )
  .option(
    "-e, --env <envName>",
    "Target environment (testing|staging|production). Overrides ENV_NAME env var.",
    "testing"
  )
  .option(
    "-c, --configId <configId>",
    "Config id. Overrides ENV_CONFIG_ID env var.",
    "testing-80002-0"
  )
  .option(
    "--infura <infuraCredentials>",
    "ProjectId and Secret required to address Infura IPFS gateway (format: <projectId>/<projectSecret>). " +
      "Overrides INFURA_CREDENTIALS env var."
  )
  .action(async (offerId: string, opts) => {
    const envName = getEnvName(opts);
    const configId = getConfigId(opts);
    const resolvedOfferId = offerId || process.env.OFFER_ID || "";
    const infura = opts.infura || process.env.INFURA_CREDENTIALS;

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );

    console.log(`Explore Offer with Id ${resolvedOfferId}`);

    const coreSDK = buildReadOnlyCoreSDK(envName, configId);

    const offers = await coreSDK.getOffers({
      offersFilter: { id: resolvedOfferId }
    });

    if (!offers || offers.length === 0) {
      console.log(`No offer found with id ${resolvedOfferId}`);
      return;
    }

    const offer = offers[0];
    console.log("Offer data:", JSON.stringify(offer, undefined, 2));

    const metadataHash = offer.metadataHash;
    if (metadataHash) {
      console.log("Fetching offer metadata...");
      const ipfsStorage = new BaseIpfsStorage({
        url: infura
          ? defaultConfig.ipfsMetadataUrl
          : defaultConfig.theGraphIpfsUrl,
        headers: infura ? buildInfuraHeaders(infura) : undefined
      });
      try {
        const metadata = await ipfsStorage.get(metadataHash);
        console.log("Metadata:", JSON.stringify(metadata, undefined, 2));
      } catch (e) {
        console.warn("Could not fetch metadata:", e);
      }
    }

    const reservedRange = await coreSDK.getRangeByOfferId(resolvedOfferId);
    console.log({
      reservedRange: {
        start: reservedRange.start.toString(),
        length: reservedRange.length.toString(),
        minted: reservedRange.minted.toString(),
        lastBurnedTokenId: reservedRange.lastBurnedTokenId.toString()
      }
    });
  });
