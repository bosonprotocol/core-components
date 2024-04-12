import { CROSS_CHAIN_SEAPORT_V1_6_ADDRESS } from "@opensea/seaport-js/lib/constants";
import { Chain, OpenSeaSDK, OrderSide } from "opensea-js";
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
  .argument("<BUYER_PRIVATE_KEY>", "Private key of the Buyer.")
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .requiredOption("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80001-0")
  .parse(process.argv);

async function main() {
  const [buyerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey;
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80001-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const buyerWallet = new Wallet(buyerPrivateKey);
  const sellerWalletV6: WalletV6 = new WalletV6(buyerPrivateKey, providerV6);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(provider, buyerWallet),
    envName,
    configId
  });
  const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

  const { offerId, exchangeId } = coreSDK.parseTokenId(tokenId);
  console.log({
    offerId: offerId.toString(),
    exchangeId: exchangeId.toString()
  });
  // const openseaUrl = API_BASE_TESTNET;
  const openseaUrl = "http://localhost:3334";
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
  const osOffer = {
    asset: {
      tokenAddress: nftContract,
      tokenId: tokenId
    },
    accountAddress: buyerWallet.address,
    startAmount: "0.0001",
    expirationTime: Math.floor(Date.now() / 1000) + 3600, // should be greater than now + 10 mins
    paymentTokenAddress: WETH_ADDRESS // can't be anything else than WETH on Polygon/Mumbai
    // englishAuction: true,
    // excludeOptionalCreatorFees: true
  };

  console.log(
    `Create a listing for token ${tokenId} on contract ${nftContract}`
  );
  const orderV2 = await createBid(openseaSdk, osOffer);
  console.log("Order created:", orderV2);
  console.log("Order protocolData:", JSON.stringify(orderV2.protocolData));
  const bidOrderV2 = orderV2.protocolData.parameters;
  const orderHash = openseaSdk.seaport_v1_6.getOrderHash(bidOrderV2);
  console.log("orderHash", orderHash);
  const signature = await openseaSdk.seaport_v1_6.signOrder(bidOrderV2);
  console.log("signature", signature);
}

async function createBid(openseaSdk: OpenSeaSDK, osOffer: any) {
  const price = "100000000000000";
  const fees = "2500000000000";
  const zone = "0x000056F7000000EcE9003ca63978907a00FFD100";
  const domain = undefined;
  const salt = undefined;
  const quantity = undefined;
  const { nft } = await openseaSdk.api.getNFT(
    osOffer.asset.tokenAddress,
    osOffer.asset.tokenId
  );
  const considerationAssetItems = openseaSdk["getNFTItems"](
    [nft],
    // [BigInt(quantity ?? 1)]
    [BigInt(1)]
  );
  const considerationFeeItems = [
    {
      itemType: 1,
      token: osOffer.paymentTokenAddress,
      identifierOrCriteria: "0",
      amount: fees,
      startAmount: fees,
      endAmount: fees,
      recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
    }
  ];

  const orderParams = {
    offer: [
      {
        itemType: 1,
        token: osOffer.paymentTokenAddress,
        amount: price,
        startAmount: price,
        endAmount: price
      }
    ],
    consideration: [...considerationAssetItems, ...considerationFeeItems],
    endTime: osOffer.expirationTime.toString(),
    zone,
    domain,
    // salt: BigInt(salt ?? 0).toString(),
    salt: BigInt(0).toString(),
    restrictedByZone: true,
    allowPartialFills: false
  };
  console.log(orderParams);

  const { executeAllActions } = await openseaSdk.seaport_v1_6.createOrder(
    orderParams,
    osOffer.accountAddress
  );
  const order = await executeAllActions();

  return openseaSdk.api.postOrder(order, {
    protocol: "seaport",
    protocolAddress: CROSS_CHAIN_SEAPORT_V1_6_ADDRESS,
    side: OrderSide.BID
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
