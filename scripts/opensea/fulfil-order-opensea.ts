import { Chain, OpenSeaSDK, OrderSide } from "opensea-js";
import { EnvironmentType, Side, getEnvConfigById } from "@bosonprotocol/common";
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
  AdvancedOrder,
  CriteriaResolver,
  Fulfillment,
  encodeMatchAdvancedOrders
} from "../../packages/core-sdk/src/seaport/interface";

program
  .description("Fulfil an Order on Opensea.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<TOKEN_ID>", "tokenId of the token to be listed")
  .requiredOption("-k, --apiKey <OPENSEA_API_KEY>", "Opensea API Key")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

const WETH_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

async function main() {
  const [sellerPrivateKey, tokenId] = program.args;

  const opts = program.opts();
  const OPENSEA_API_KEY = opts.openseaApiKey;
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
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
  console.log("offer", offer);
  const nftContract = offer.collection.collectionContract.address;
  console.log(`fulfil order for token ${tokenId} on contract ${nftContract}`);
  const order = await openseaSdk.api.getOrder({
    assetContractAddress: nftContract,
    tokenId,
    side: OrderSide.BID
  });
  if (!order || !order.orderHash) {
    return;
  }
  console.log("ORDER", order);
  console.log("OFFER", order.protocolData.parameters.offer);
  console.log("CONSIDERATION", order.protocolData.parameters.consideration);
  console.log("TAKER", JSON.stringify(order.takerFees));
  const BOSON_PD_CLIENT = "0x74874fF29597b6e01E16475b7BB9D6dC954d0411";
  const BOSON_PROTOCOL = "0x76051FC05Ab42D912a737d59a8711f1446712630";
  const OPENSEA_CONDUIT = "0x1e0049783f008a0085193e00003d00cd54003c71";

  const ffd = await openseaSdk.api.generateFulfillmentData(
    BOSON_PD_CLIENT, // the address of the PriceDiscoveryClient contract, which will call the fulfilment method
    order.orderHash,
    order.protocolAddress,
    order.side
  );
  console.log("FFD", ffd);
  console.log("FFD.orders", ffd.fulfillment_data.orders);
  const inputData = ffd.fulfillment_data.transaction.input_data as unknown as {
    orders: AdvancedOrder[];
    criteriaResolvers: CriteriaResolver[];
    fulfillments: Fulfillment[];
    recipient: string;
  };
  console.log("FFD_input", JSON.stringify(inputData));

  const buyerAddress = order.maker.address;
  const price = inputData.orders[1].parameters.consideration[0].startAmount;
  const side = Side.Bid; // ?
  const priceDiscoveryContract = order.protocolAddress;
  const conduit = OPENSEA_CONDUIT;
  const priceDiscoveryData = encodeMatchAdvancedOrders(
    inputData.orders,
    inputData.criteriaResolvers,
    inputData.fulfillments,
    inputData.recipient
  );
  await approveIfNeeded(BOSON_PROTOCOL, nftContract, coreSDK);
  const commitTx = await coreSDK.commitToPriceDiscoveryOffer(
    buyerAddress,
    tokenId,
    {
      price,
      side,
      priceDiscoveryContract,
      conduit,
      priceDiscoveryData
    }
  );
  console.log("commit tx", commitTx.hash);
  await commitTx.wait();
}

async function approveIfNeeded(
  operator: string,
  nftContract: string,
  coreSDK: CoreSDK
) {
  const isApprovedForAll1 = await coreSDK.isApprovedForAll(operator, {
    contractAddress: nftContract
  });
  if (!isApprovedForAll1) {
    const approveTx = await coreSDK.approveProtocolForAll({
      operator: operator
    });
    console.log(`approveProtocolForAll tx ${approveTx.hash}...`);
    await approveTx.wait();
    console.log("done");
    const isApprovedForAll2 = await coreSDK.isApprovedForAll(operator, {
      contractAddress: nftContract
    });
    console.log(`${operator} is approved for all: ${isApprovedForAll2}`);
  } else {
    console.log(`${operator} is approved for all: ${isApprovedForAll1}`);
  }
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
