import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { ethers, providers, Wallet } from "ethers";
import { program } from "commander";
import fs from "fs";
import { getEnvConfigById } from "@bosonprotocol/common/src";
import { CoreSDK, validateMetadata } from "../packages/core-sdk/src";
import { AgentAdapter } from "../packages/ethers-sdk/src";
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { TransactionRequest } from "@bosonprotocol/common";
import dayjs from "dayjs";

program
  .description("Create an Offer.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<OFFER_DATA>", "JSON file with the Offer parameters")
  .argument("<infuraIpfsProjectId>", "infuraIpfsProjectId")
  .argument("<infuraIpfsProjectSecret>", "infuraIpfsProjectSecret")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("-c, --configId <CONFIG_ID>", "Config id", "testing-80002-0")
  .parse(process.argv);

function getIpfsMetadataStorageHeaders(
  infuraProjectId?: string,
  infuraProjectSecret?: string
) {
  if (!infuraProjectId && !infuraProjectSecret) {
    return undefined;
  }

  return {
    authorization: `Basic ${Buffer.from(
      infuraProjectId + ":" + infuraProjectSecret
    ).toString("base64")}`
  };
}

async function main() {
  const [
    sellerPrivateKey,
    offerDataJsonFile,
    infuraIpfsProjectId,
    infuraIpfsProjectSecret
  ] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const configId = opts.configId || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const rawData = fs.readFileSync(offerDataJsonFile);
  const metadataStorageUrl = defaultConfig.ipfsMetadataUrl;
  const theGraphStorageUrl =
    defaultConfig.theGraphIpfsUrl || metadataStorageUrl;
  const ipfsMetadataStorageHeaders = getIpfsMetadataStorageHeaders(
    infuraIpfsProjectId,
    infuraIpfsProjectSecret
  );
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const wallet = new Wallet(sellerPrivateKey);
  const connectedWallet = wallet.connect(provider);

  // 3. Check wallet balance (you'll need MATIC for gas fees)
  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet balance:", ethers.utils.formatEther(balance), "MATIC");

  if (balance.eq(0n)) {
    console.log(
      "⚠️  Wallet has no MATIC. You need to fund it from a faucet first."
    );
    console.log("Get testnet MATIC from: https://faucet.polygon.technology/");
    return;
  }

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new AgentAdapter(provider, {
      signerAddress: "0x9c2925a41d6FB1c6C8f53351634446B0b2E65eE8".toLowerCase()
    }),
    envName,
    configId,
    theGraphStorage: new IpfsMetadataStorage(validateMetadata, {
      url: theGraphStorageUrl,
      headers:
        theGraphStorageUrl === metadataStorageUrl
          ? ipfsMetadataStorageHeaders
          : undefined
    }),
    metadataStorage: new IpfsMetadataStorage(validateMetadata, {
      url: metadataStorageUrl,
      headers: ipfsMetadataStorageHeaders
    })
  });

  const offerMetadataDataJson = JSON.parse(rawData.toString());
  const metadataHash = await coreSDK.storeMetadata(offerMetadataDataJson);
  console.error(`Metadata uploaded with hash: ${metadataHash}`);

  // Get default dispute resolver ID if not provided
  const disputeResolverId = (await coreSDK.getDisputeResolvers())[0]?.id;
  const offerDataJson = {
    price: "0",
    sellerDeposit: "0",
    buyerCancelPenalty: "0",
    quantityAvailable: 50,
    validFromDateInMS: 0,
    validUntilDateInMS: dayjs().add(1, "month").valueOf(),
    voucherRedeemableFromDateInMS: new Date().getTime(),
    voucherRedeemableUntilDateInMS: 0,
    disputePeriodDurationInMS: 2591000000,
    voucherValidDurationInMS: 500000,
    resolutionPeriodDurationInMS: 604800000,
    agentId: "0",
    exchangeToken: ethers.constants.AddressZero,
    disputeResolverId: disputeResolverId,
    metadataUri: `ipfs://${metadataHash}`,
    metadataHash: metadataHash,
    collectionIndex: "0"
  };

  const transactionData: TransactionRequest = await coreSDK.createOffer(
    offerDataJson,
    {
      returnTxInfo: true
    }
  );

  console.log({ transactionData });

  if (!transactionData) {
    console.error(
      "No transaction data found. Ensure the offer creation was successful."
    );
    return;
  }
  ///////////////////////// START OF AGENT PART //////////////////////////////
  // 4. Get current gas price and estimate gas
  const feeData = await provider.getFeeData();
  if (!feeData.gasPrice) {
    console.error(
      "Failed to fetch gas price. Ensure the provider is connected."
    );
    return;
  }
  const gasEstimate = await provider.estimateGas({
    to: transactionData.to,
    data: transactionData.data,
    from: wallet.address
  });

  console.log("Estimated gas:", gasEstimate.toString());
  console.log(
    "Gas price:",
    ethers.utils.formatUnits(feeData.gasPrice || 0, "gwei"),
    "gwei"
  );

  // 5. Prepare transaction object
  const transaction = {
    to: transactionData.to,
    data: transactionData.data,
    gasLimit: gasEstimate,
    gasPrice: feeData.gasPrice,
    chainId: defaultConfig.chainId,
    nonce: await provider.getTransactionCount(wallet.address)
  } satisfies TransactionRequest;

  console.log("Transaction object:", transaction);
  // 6. Sign the transaction
  const signedTransaction = await connectedWallet.signTransaction(transaction);
  console.log("Signed transaction:", signedTransaction);
  ///////////////////////// END OF AGENT PART //////////////////////////////

  // 7. Send the transaction to the blockchain
  console.log("Sending transaction...");
  // await broadcastSignedTransaction(signedTransaction, coreSDK.web3Lib);
}
async function broadcastSignedTransaction(
  signedTxHex: string,
  agentAdapter: AgentAdapter
) {
  try {
    console.log("Broadcasting pre-signed transaction...");
    console.log("Signed transaction:", signedTxHex);

    // Broadcast the signed transaction directly
    const txResponse = await agentAdapter.sendSignedTransaction(signedTxHex);
    console.log("Transaction sent! Hash:", txResponse.hash);
    console.log("Transaction details:", txResponse);

    // Wait for confirmation
    console.log("Waiting for confirmation...");
    const receipt = await txResponse.wait();
    console.log("Transaction confirmed in block:", receipt?.blockNumber);
    console.log("Gas used:", receipt?.gasUsed?.toString());
    console.log("Transaction receipt:", receipt);
    return { hash: txResponse.hash, receipt };
  } catch (error) {
    console.error("Error broadcasting transaction:", error);
    throw error;
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
