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
  .description("Create a Listing on Opensea (for Seller).")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<TOKEN_ID>", "tokenId of the preminted voucher to be listed")
  .requiredOption("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .requiredOption("-p, --price <PRICE>", "Listing Price")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

const OPENSEA_FEE_RECIPIENT = "0x0000a26b00c1F0DF003000390027140000fAa719"; // On Real OpenSea

async function main() {
  const [sellerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey;
  const PRICE = opts.price;
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
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

  const { offerId, exchangeId } = coreSDKSeller.parseTokenId(tokenId);
  console.log({
    offerId: offerId.toString(),
    exchangeId: exchangeId.toString()
  });
  const openseaUrl = API_BASE_TESTNET;
  const openseaSdkSeller = coreSDKSeller.marketplace(
    MarketplaceType.OPENSEA,
    new OpenSeaSDK(
      sellerWalletV6 as any,
      {
        chain: getOpenSeaChain(chainId),
        apiKey: OPENSEA_API_KEY,
        apiBaseUrl: openseaUrl
      },
      (line) => console.info(`SEPOLIA OS: ${line}`)
    ),
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
  const nftContract = offer.collection.collectionContract.address;
  const listing: Listing = {
    asset: {
      contract: nftContract,
      tokenId: tokenId
    },
    offerer: sellerWallet.address,
    price: PRICE,
    expirationTime: Math.floor(Date.now() / 1000) + 3600, // should be greater than now + 10 mins
    exchangeToken: {
      address: offer.exchangeToken.address, // can't be anything else than WETH on testnet
      decimals: Number(offer.exchangeToken.decimals)
    },
    auction: true
  };
  console.log(
    `Seller creates a listing for token ${tokenId} on contract ${nftContract}`
  );

  const listingOrder = await openseaSdkSeller.createListing(listing);
  console.log("Listing Order:", listingOrder);
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