import { CROSS_CHAIN_SEAPORT_V1_6_ADDRESS } from "@opensea/seaport-js/lib/constants";
import { EnvironmentType, getEnvConfigById } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet, Contract } from "ethers";
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
import { MOCK_ERC20_ABI } from "../../e2e/tests/mockAbis";

program
  .description("Create a Listing on Opensea.")
  .argument("<BUYER_PRIVATE_KEY>", "Private key of the Buyer.")
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .option("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .requiredOption("-p, --price <PRICE>", "Listing Price")
  .option("-e, --env <ENV_NAME>", "Target environment")
  .option("-c, --configId <CONFIG_ID>", "Config id")
  .parse(process.argv);

const OPENSEA_FEE_RECIPIENT = "0x0000a26b00c1F0DF003000390027140000fAa719"; // On Real OpenSea
const OPENSEA_ZONE = "0x000056F7000000EcE9003ca63978907a00FFD100"; // Required by OpenSea

async function main() {
  const [buyerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey || process.env.OPENSEA_API_KEY;
  const PRICE = opts.price;
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
  const openseaSdkBuyer = coreSDKBuyer.marketplace(
    MarketplaceType.OPENSEA,
    createOpenSeaSDK(buyerWalletV6, chainId, OPENSEA_API_KEY, defaultConfig),
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
  if (chainId === 31337) {
    // On local env, mint ERC20 tokens for buyer
    const mockErc20Contract = new Contract(
      offer.exchangeToken.address,
      MOCK_ERC20_ABI,
      buyerWallet.connect(provider)
    );
    await (await mockErc20Contract.mint(buyerWallet.address, PRICE)).wait();
  }
  const nftContract = offer.collection.collectionContract.address;
  const { wrapped, wrapper } = await openseaSdkBuyer.isVoucherWrapped(
    nftContract,
    tokenId
  );
  // On local env, Zone must be set to the seaport caller (to shortcut zone verification)
  const zone =
    chainId === 31337
      ? wrapped
        ? wrapper
        : defaultConfig.contracts.priceDiscoveryClient
      : OPENSEA_ZONE;
  const bidOffer: Listing = {
    asset: {
      contract: wrapped ? (wrapper as string) : nftContract,
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
    protocolAddress: defaultConfig.contracts.seaport || CROSS_CHAIN_SEAPORT_V1_6_ADDRESS,
    zone
  };
  if (wrapped) {
    console.log(
      `Buyer creates a bid offer for wrapped token ${tokenId} on contract ${wrapper}`
    );
  } else {
    console.log(
      `Buyer creates a bid offer for token ${tokenId} on contract ${nftContract}`
    );
  }
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
