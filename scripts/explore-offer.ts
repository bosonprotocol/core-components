import { BigNumber } from "@ethersproject/bignumber";
import { CreateOfferArgs } from "./../packages/common/src/types/offers";
import fs from "fs";
import { EnvironmentType } from "./../packages/common/src/types/configs";
import { IpfsMetadataStorage } from "./../packages/ipfs-storage/src/ipfs/metadata";
import { AddressZero } from "@ethersproject/constants";
import { erc20Iface } from "./../packages/core-sdk/src/erc20/interface";
import { providers, Contract } from "ethers";
import { program } from "commander";
import { abis } from "@bosonprotocol/common";
import { getEnvConfigById } from "../packages/common/src";
import {
  extractAgentId,
  extractOfferData,
  extractOfferDataExtended,
  OfferData
} from "./utils/offer";
import {
  ITokenInfo,
  NATIVE_TOKENS
} from "../packages/core-sdk/src/utils/tokenInfoManager";
import { buildInfuraHeaders } from "./utils/infura";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Explore an on-chain Offer.")
  .argument("<OFFER_ID>", "Id of the Offer")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .option("--export <FILEPATH>", "Export offer data to a JSON file")
  .option(
    "--infura <INFURA_PROJECT_ID>/<INFURA_PROJECT_SECRET>",
    "ProjectId and Secret required to address Infura IPFS gateway"
  )
  .parse(process.argv);

async function main() {
  const [offerId] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80001-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const web3Provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);

  console.log(`Explore Offer with Id ${offerId}`);
  console.log("defaultConfig", defaultConfig);

  const offerAbi = abis.IBosonOfferHandlerABI;

  const offerHandler = new Contract(
    defaultConfig.contracts.protocolDiamond,
    offerAbi,
    web3Provider
  );

  const offerDataRaw = await offerHandler.getOffer(offerId);
  const offerData = extractOfferData(offerDataRaw);
  const tokenInfo = await getTokenInfo(
    offerData.offer.exchangeToken,
    web3Provider,
    chainId
  );
  const agentIdRaw = await offerHandler.getAgentIdByOffer(offerId);
  const { agentId } = extractAgentId(agentIdRaw);
  const extendedOfferData = extractOfferDataExtended(offerDataRaw, tokenInfo);
  console.log("extendedOfferData", extendedOfferData);

  console.log("Fetching offer metadata...");
  const ipfsMetadataStorage = new IpfsMetadataStorage({
    url: opts.infura
      ? defaultConfig.ipfsMetadataUrl
      : defaultConfig.theGraphIpfsUrl,
    headers: opts.infura ? buildInfuraHeaders(opts.infura) : undefined
  });
  const metadata = await ipfsMetadataStorage.get(offerData.offer.metadataHash);
  console.log("metadata", metadata);

  if (opts.export) {
    exportOfferData(opts.export, offerData, agentId);
  }

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName,
    configId
  });
  const reservedRange = await coreSDK.getRangeByOfferId(offerId);
  console.log({
    reservedRange: {
      start: reservedRange.start.toString(),
      length: reservedRange.length.toString(),
      minted: reservedRange.minted.toString(),
      lastBurnedTokenId: reservedRange.lastBurnedTokenId.toString()
    }
  });
}

main()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

async function getTokenInfo(
  exchangeToken: string,
  web3Provider: providers.JsonRpcProvider,
  chainId: number
): Promise<ITokenInfo> {
  if (!NATIVE_TOKENS[chainId]) {
    throw new Error(`Unexpected chainId value '${chainId}'`);
  }
  if (exchangeToken === AddressZero) {
    return NATIVE_TOKENS[chainId];
  }
  const tokenContract = new Contract(exchangeToken, erc20Iface, web3Provider);
  const [decimals, name, symbol] = await Promise.all([
    tokenContract.decimals(),
    tokenContract.name(),
    tokenContract.symbol()
  ]);
  return {
    decimals,
    name,
    symbol
  };
}

function exportOfferData(
  filePath: string,
  offerData: OfferData,
  agentId: string
) {
  console.log("Export offer creation data to", filePath);
  const createOfferArgs: CreateOfferArgs = {
    price: offerData.offer.price,
    sellerDeposit: offerData.offer.sellerDeposit,
    agentId,
    buyerCancelPenalty: offerData.offer.buyerCancelPenalty,
    quantityAvailable: offerData.offer.quantityAvailable,
    validFromDateInMS: secToMSec(offerData.offerDates.validFrom),
    validUntilDateInMS: secToMSec(offerData.offerDates.validUntil),
    voucherRedeemableFromDateInMS: secToMSec(
      offerData.offerDates.voucherRedeemableFrom
    ),
    voucherRedeemableUntilDateInMS: secToMSec(
      offerData.offerDates.voucherRedeemableUntil
    ),
    disputePeriodDurationInMS: secToMSec(
      offerData.offerDurations.disputePeriod
    ),
    voucherValidDurationInMS: secToMSec(offerData.offerDurations.voucherValid),
    resolutionPeriodDurationInMS: secToMSec(
      offerData.offerDurations.resolutionPeriod
    ),
    exchangeToken: offerData.offer.exchangeToken,
    disputeResolverId: offerData.disputeResolutionTerms.disputeResolverId,
    metadataUri: offerData.offer.metadataUri,
    metadataHash: offerData.offer.metadataHash
  };
  fs.writeFileSync(filePath, JSON.stringify(createOfferArgs, undefined, 2));
}

function secToMSec(sec: string): string {
  return BigNumber.from(sec).mul(1000).toString();
}
