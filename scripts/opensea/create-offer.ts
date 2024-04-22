import { CROSS_CHAIN_SEAPORT_V1_6_ADDRESS } from "@opensea/seaport-js/lib/constants";
import { OpenSeaSDK } from "opensea-js";
import { EnvironmentType, getEnvConfigById } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet } from "ethers";
import {
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { CoreSDK } from "../../packages/core-sdk/src";
import { API_BASE_TESTNET } from "opensea-js/lib/constants";
import {
  Listing,
  MarketplaceType
} from "../../packages/core-sdk/src/marketplaces/types";
import { getOpenSeaChain } from "./utils";

program
  .description("Create a Listing on Opensea.")
  .argument("<BUYER_PRIVATE_KEY>", "Private key of the Buyer.")
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .requiredOption("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .requiredOption("-p, --price <PRICE>", "Listing Price")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

const OPENSEA_FEE_RECIPIENT = "0x0000a26b00c1F0DF003000390027140000fAa719"; // On Real OpenSea
const OPENSEA_ZONE = "0x000056F7000000EcE9003ca63978907a00FFD100"; // Required by OpenSea

async function main() {
  const [buyerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey;
  const PRICE = opts.price;
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const buyerWallet = new Wallet(buyerPrivateKey);
  const buyerWalletV6: WalletV6 = new WalletV6(buyerPrivateKey, providerV6);
  const coreSDKBuyer = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(provider, buyerWallet),
    envName,
    configId
  });
  const WETH_ADDRESS = (defaultConfig.defaultTokens || []).find(
    (t) => t.symbol === "WETH"
  )?.address;

  const { offerId, exchangeId } = coreSDKBuyer.parseTokenId(tokenId);
  console.log({
    offerId: offerId.toString(),
    exchangeId: exchangeId.toString()
  });
  const openseaUrl = API_BASE_TESTNET;
  const openseaSdkBuyer = coreSDKBuyer.marketplace(
    MarketplaceType.OPENSEA,
    new OpenSeaSDK(
      buyerWalletV6 as any,
      {
        chain: getOpenSeaChain(chainId),
        apiKey: OPENSEA_API_KEY,
        apiBaseUrl: openseaUrl
      },
      (line) => console.info(`SEPOLIA OS: ${line}`)
    ),
    OPENSEA_FEE_RECIPIENT
  );
  const offer = await coreSDKBuyer.getOfferById(offerId);
  if (
    !!WETH_ADDRESS &&
    offer.exchangeToken.address.toLowerCase() !== WETH_ADDRESS?.toLowerCase()
  ) {
    throw new Error(
      `Exchange Token must be Wrapped Native Currency ${WETH_ADDRESS} for Price Discovery offers (Opensea req)`
    );
  }
  const nftContract = offer.collection.collectionContract.address;
  const bidOffer: Listing = {
    asset: {
      contract: nftContract,
      tokenId: tokenId
    },
    offerer: buyerWallet.address,
    price: PRICE,
    expirationTime: Math.floor(Date.now() / 1000) + 3600, // should be greater than now + 10 mins
    exchangeToken: {
      address: offer.exchangeToken.address, // can't be anything else than WETH on testnet
      decimals: Number(offer.exchangeToken.decimals)
    },
    auction: false,
    protocolAddress: CROSS_CHAIN_SEAPORT_V1_6_ADDRESS,
    zone: OPENSEA_ZONE
  };
  console.log(
    `Buyer creates a bid offer for token ${tokenId} on contract ${nftContract}`
  );
  console.log("bidOffer", bidOffer);
  const bidOrder = await openseaSdkBuyer.createBidOrder(bidOffer);
  console.log("Order created:", bidOrder);
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
