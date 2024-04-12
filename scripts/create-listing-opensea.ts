import { Chain, OpenSeaSDK } from "opensea-js";
import { EnvironmentType, getEnvConfigById } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet } from "ethers";
import {
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { API_BASE_TESTNET } from "opensea-js/lib/constants";

program
  .description("Create a Listing on Opensea.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .requiredOption("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey;
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80001-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const sellerWallet = new Wallet(sellerPrivateKey);
  const sellerWalletV6: WalletV6 = new WalletV6(sellerPrivateKey, providerV6);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(provider, sellerWallet),
    envName,
    configId
  });
  const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

  const { offerId, exchangeId } = coreSDK.parseTokenId(tokenId);
  console.log({
    offerId: offerId.toString(),
    exchangeId: exchangeId.toString()
  });
  const openseaUrl = API_BASE_TESTNET;
  // const openseaUrl = "http://localhost:3334";
  const openseaSdk = new OpenSeaSDK(
    sellerWalletV6 as any,
    {
      chain: Chain.Mumbai,
      apiKey: OPENSEA_API_KEY,
      apiBaseUrl: openseaUrl
    },
    (line) => console.info(`MUMBAI OS: ${line}`)
  );
  (openseaSdk.api as any).apiBaseUrl = openseaUrl; // << force the API URL to allow using local mock
  const offer = await coreSDK.getOfferById(offerId);
  if (
    offer.exchangeToken.address.toLowerCase() !== WETH_ADDRESS.toLowerCase()
  ) {
    throw new Error(
      `Exchange Token must be Wrapped Native Currency ${WETH_ADDRESS} for Price Discovery offers (Opensea req)`
    );
  }
  const nftContract = offer.collection.collectionContract.address;
  console.log(
    `Create a listing for token ${tokenId} on contract ${nftContract}`
  );
  const listing = {
    asset: {
      tokenAddress: nftContract,
      tokenId: tokenId
    },
    accountAddress: sellerWallet.address,
    startAmount: "0.0001",
    expirationTime: Math.floor(Date.now() / 1000) + 3600, // should be greater than now + 10 mins
    paymentTokenAddress: WETH_ADDRESS, // can't be anything else than WETH on Polygon/Mumbai
    englishAuction: true,
    excludeOptionalCreatorFees: true
  };

  const orderV2 = await openseaSdk.createListing(listing);
  console.log("Order created:", orderV2);
  console.log("Order protocolData:", JSON.stringify(orderV2.protocolData));
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
