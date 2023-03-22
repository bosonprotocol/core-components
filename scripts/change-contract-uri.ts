import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers, Wallet } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Change contract URI.")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument("<CONTRACT_URI>", "Contract URI to set in the seller's voucher")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, contractURI] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
  const chainId = defaultConfig.chainId;
  const sellerWallet = new Wallet(sellerPrivateKey);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      sellerWallet
    ),
    envName
  });

  console.log(
    `Updating seller's voucher on env ${envName} on chain ${chainId}...`
  );
  const txResponse = await coreSDK.setContractURI(contractURI);
  await txResponse.wait();
  console.log(`Tx hash: ${txResponse.hash}`);

  console.log(`ContractURI has been changed.`);
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
