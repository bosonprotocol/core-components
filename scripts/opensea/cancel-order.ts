import { EnvironmentType, getEnvConfigById, Side } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet } from "ethers";
import {
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { CoreSDK } from "../../packages/core-sdk/src";
import {
  Listing,
  MarketplaceType
} from "../../packages/core-sdk/src/marketplaces/types";
import { createOpenSeaSDK } from "./utils";

program
  .description("Create a Listing on Opensea (for Seller).")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<TOKEN_ID>", "tokenId of the preminted voucher to be listed")
  .option("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .option("-e, --env <ENV_NAME>", "Target environment")
  .option("-c, --configId <CONFIG_ID>", "Config id")
  .option("--contract <CONTRACT>", "NFT contract address")
  .parse(process.argv);

const OPENSEA_FEE_RECIPIENT = "0x0000a26b00c1F0DF003000390027140000fAa719"; // On Real OpenSea

async function main() {
  const [sellerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey || process.env.OPENSEA_API_KEY;
  const envName = opts.env || process.env.ENV_NAME || "testing";
  const configId =
    opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  if (chainId !== 31337 && !OPENSEA_API_KEY) {
    throw new Error(`OPENSEA_API_KEY [-k, --apiKey] option is required`);
  }
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const sellerWallet = new Wallet(sellerPrivateKey);
  const sellerWalletV6: WalletV6 = new WalletV6(sellerPrivateKey, providerV6);
  const coreSDKSeller = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(provider, sellerWallet),
    envName,
    configId
  });
  const WETH_ADDRESS = (defaultConfig.defaultTokens || []).find(
    (t) => t.symbol === "WETH"
  )?.address;

  const contract = opts.contract;
  const { offerId, exchangeId } = coreSDKSeller.parseTokenId(tokenId);
  console.log({
    offerId: offerId.toString(),
    exchangeId: exchangeId.toString()
  });
  const openseaSdkSeller = coreSDKSeller.marketplace(
    MarketplaceType.OPENSEA,
    createOpenSeaSDK(sellerWalletV6, chainId, OPENSEA_API_KEY, defaultConfig),
    OPENSEA_FEE_RECIPIENT
  );
  const offer = await coreSDKSeller.getOfferById(offerId);
  if (
    !!WETH_ADDRESS &&
    offer.exchangeToken.address.toLowerCase() !== WETH_ADDRESS?.toLowerCase()
  ) {
    throw new Error(
      `Exchange Token must be Wrapped Native Currency ${WETH_ADDRESS} for Price Discovery offers (Opensea req)`
    );
  }
  let nftContract = contract ?? offer.collection.collectionContract.address;
  const { wrapped, wrapper } = await openseaSdkSeller.isVoucherWrapped(
    nftContract,
    tokenId
  );
  if (wrapped) {
    nftContract = wrapper;
  }
  console.log(
    `Cancel order a listing for token ${tokenId} on contract ${nftContract}`
  );

  await openseaSdkSeller.cancelOrder(
    { contract: nftContract, tokenId },
    Side.Ask
  );
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
