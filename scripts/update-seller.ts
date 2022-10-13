import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { Wallet, providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig, UpdateSellerArgs } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import { CreateSellerArgs } from "../packages/core-sdk/src/accounts";

program
  .description("Updates a seller.")
  .argument("<SELLER_ADMIN_PK>", "Private key of the seller admin account.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .parse(process.argv);

async function main() {
  const [sellerAdminPrivateKey] = program.args;

  const opts = program.opts();
  const envName = (opts.env as EnvironmentType) || "testing";
  const defaultConfig = getDefaultConfig(envName);
  const chainId = defaultConfig.chainId;

  const sellerAdminWallet = new Wallet(sellerAdminPrivateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      sellerAdminWallet
    ),
    envName
  });

  // struct/obj with the seller addresses
  const addresses: UpdateSellerArgs = {
    id: "",
    admin: "0x0000000000000000000000000000000000000000",
    operator: "<INSERT-YOUR-WALLET>",
    clerk: "<INSERT-YOUR-WALLET>",
    treasury: "<INSERT-YOUR-WALLET>",
    authTokenId: "18832",
    authTokenType: 2
  };

  const txResponse = await coreSDK.updateSeller(addresses);
  console.log(txResponse)
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });