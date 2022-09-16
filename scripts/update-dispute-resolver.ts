import { DisputeResolutionFee } from "./../packages/core-sdk/src/accounts/types";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { Wallet, providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Updates a dispute resolver.")
  .argument("<DR_ADMIN_PK>", "Private key of the DR admin account.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option(
    "--addFees <...FEES>",
    "Comma-separated list of dispute resolution fee tuples with the format: <TOKEN_ADDRESS>/<TOKEN_NAME>/<FEE_AMOUNT>"
  )
  .option("--rmFees <...FEES>", "Comma-separated list of token addresses")
  .option(
    "--addSellers <...SELLERS>",
    "Comma-separated list of allowed seller IDs."
  )
  .option(
    "--rmSellers <...SELLERS>",
    "Comma-separated list of seller IDs. to remove"
  )
  .parse(process.argv);

async function main() {
  const [drAdminPrivateKey] = program.args;

  const opts = program.opts();
  const envName = (opts.env as EnvironmentType) || "testing";
  const defaultConfig = getDefaultConfig(envName);
  const chainId = defaultConfig.chainId;
  const addFees = opts.addFees
    ? (opts.addFees as string)
        .split(",")
        .map((tupleString) => tupleString.split("/"))
        .map((tuple) => ({
          tokenAddress: tuple[0],
          tokenName: tuple[1],
          feeAmount: tuple[2]
        }))
    : [];
  const rmFees = opts.rmFees ? (opts.rmFees as string).split(",") : [];
  const addSellers = opts.addSellers
    ? (opts.addSellers as string).split(",")
    : [];
  const rmSellers = opts.rmSellers ? (opts.rmSellers as string).split(",") : [];

  const drAdminWallet = new Wallet(drAdminPrivateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      drAdminWallet
    ),
    envName
  });

  const adminAddress = drAdminWallet.address;
  console.log(
    `Search for dispute resolver on env ${envName} for address ${adminAddress}...`
  );
  const drs = await coreSDK.getDisputeResolvers({
    disputeResolversFilter: {
      admin: adminAddress.toLowerCase()
    }
  });
  if (drs.length === 0) {
    throw new Error("No disputeResolver found");
  }
  if (drs.length > 1) {
    throw new Error("More than one disputeResolver found");
  }
  console.log(`DisputeResolverId: ${drs[0].id}`);
  console.log(`DisputeResolver Current Fees: ${JSON.stringify(drs[0].fees)}`);
  console.log(
    `DisputeResolver Current Sellers: ${JSON.stringify(drs[0].sellerAllowList)}`
  );

  if (addFees.length > 0) {
    await addFeesFn(coreSDK, drs[0].id, addFees);
  }

  if (rmFees.length > 0) {
    await rmFeesFn(coreSDK, drs[0].id, rmFees);
  }

  if (addSellers.length > 0) {
    await addSellersFn(coreSDK, drs[0].id, addSellers);
  }

  if (rmSellers.length > 0) {
    await rmSellersFn(coreSDK, drs[0].id, rmSellers);
  }
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

async function addFeesFn(
  coreSDK: CoreSDK,
  disputeResolverId: string,
  addFees: DisputeResolutionFee[]
) {
  console.log(`Add fees: ${addFees.map((fee) => JSON.stringify(fee))}`);
  const txResponse = await coreSDK.addFeesToDisputeResolver(
    disputeResolverId,
    addFees
  );
  console.log(`Tx hash: ${txResponse.hash}`);
  await txResponse.wait();
  console.log(`Dispute resolver with id ${disputeResolverId} updated.`);
}

async function rmFeesFn(
  coreSDK: CoreSDK,
  disputeResolverId: string,
  rmFees: string[]
) {
  console.log(`Remove fees: ${rmFees}`);
  const txResponse = await coreSDK.removeFeesFromDisputeResolver(
    disputeResolverId,
    rmFees
  );
  console.log(`Tx hash: ${txResponse.hash}`);
  await txResponse.wait();
  console.log(`Dispute resolver with id ${disputeResolverId} updated.`);
}

async function addSellersFn(
  coreSDK: CoreSDK,
  disputeResolverId: string,
  sellers: string[]
) {
  console.log(`Add Sellers: ${sellers}`);
  const txResponse = await coreSDK.addSellersToDisputeResolverAllowList(
    disputeResolverId,
    sellers
  );
  console.log(`Tx hash: ${txResponse.hash}`);
  await txResponse.wait();
  console.log(`Dispute resolver with id ${disputeResolverId} updated.`);
}

async function rmSellersFn(
  coreSDK: CoreSDK,
  disputeResolverId: string,
  sellers: string[]
) {
  console.log(`Remove Sellers: ${sellers}`);
  const txResponse = await coreSDK.removeSellersFromDisputeResolverAllowList(
    disputeResolverId,
    sellers
  );
  console.log(`Tx hash: ${txResponse.hash}`);
  await txResponse.wait();
  console.log(`Dispute resolver with id ${disputeResolverId} updated.`);
}
