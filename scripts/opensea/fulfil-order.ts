import { EnvironmentType, Side, getEnvConfigById } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet } from "ethers";
import {
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { CoreSDK } from "../../packages/core-sdk/src";
import { approveIfNeeded, createOpenSeaSDK } from "./utils";
import { MarketplaceType } from "../../packages/core-sdk/src/marketplaces/types";

program
  .description("Fulfil an Order on Opensea.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .option("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .option("-e, --env <ENV_NAME>", "Target environment")
  .option("-c, --configId <CONFIG_ID>", "Config id")
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
  const nftContract = offer.collection.collectionContract.address;
  const { wrapped, wrapper } = await openseaSdkSeller.isVoucherWrapped(
    nftContract,
    tokenId
  );
  if (wrapped) {
    console.log(
      `fulfil order for wrapped token ${tokenId} on contract ${wrapper}`
    );
  } else {
    console.log(`fulfil order for token ${tokenId} on contract ${nftContract}`);
  }
  const order = await openseaSdkSeller.getOrder(
    {
      contract: wrapped ? (wrapper as string) : nftContract,
      tokenId
    },
    Side.Bid
  );
  if (!order || !order.orderHash) {
    throw new Error(
      `No Order found for token ${tokenId} on contract ${nftContract}`
    );
  }
  console.log("ORDER TO BE FULFILLED", order);
  const priceDiscoveryStruct = await openseaSdkSeller.generateFulfilmentData(
    {
      contract: nftContract,
      tokenId
    },
    wrapped
  );

  const BOSON_PROTOCOL = defaultConfig.contracts.protocolDiamond;

  console.log(
    `Seller creates a fulfillment order for token ${tokenId} on contract ${nftContract}`
  );

  const buyerAddress = order.maker.address;
  if (wrapped) {
    await approveIfNeeded(wrapper as string, wrapper as string, coreSDKSeller);
  } else {
    await approveIfNeeded(BOSON_PROTOCOL, nftContract, coreSDKSeller);
  }
  const commitTx = await coreSDKSeller.commitToPriceDiscoveryOffer(
    buyerAddress,
    tokenId,
    priceDiscoveryStruct
  );
  console.log("commitToPriceDiscoveryOffer tx submitted ...", commitTx.hash);
  await commitTx.wait();
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
