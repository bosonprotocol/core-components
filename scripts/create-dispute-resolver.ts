import { EnvironmentType } from "./../packages/common/src/types/configs";
import { Wallet, providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "../packages/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";
import {
  MSEC_PER_DAY,
  MSEC_PER_SEC
} from "@bosonprotocol/common/src/utils/timestamp";

program
  .description("Creates and activates a dispute resolver.")
  .argument("<PROTOCOL_ADMIN_PK>", "Private key of account with ADMIN role.")
  .argument(
    "<DR_ADMIN_PK>",
    "Private key of Admin address of dispute resolver. Same address will be used for clerk, treasury and operator."
  )
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option(
    "-esc, --escalation-period <PERIOD_IN_MS>",
    "Escalation response period in milliseconds."
  )
  .option(
    "-m, --metadata <METADATA_URI>",
    "Metadata URI of dispute resolver.",
    "ipfs://dispute-resolver-uri"
  )
  .option(
    "-f, --fees <...FEES>",
    "Comma-separated list of dispute resolution fee tuples with the format: <TOKEN_ADDRESS>/<TOKEN_NAME>/<FEE_AMOUNT>",
    "0x0000000000000000000000000000000000000000/ETH/0"
  )
  .option(
    "-s, --sellers <...SELLERS>",
    "Comma-separated list of allowed seller IDs."
  )
  .parse(process.argv);

async function main() {
  const [protocolAdminPrivateKey, disputeResolverAdminPrivateKey] =
    program.args;

  const opts = program.opts();
  const escalationResponsePeriodInMS =
    opts.escalationResponsePeriod || 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC;
  const disputeResolverAdminWallet = new Wallet(disputeResolverAdminPrivateKey);
  const operator = disputeResolverAdminWallet.address;
  const clerk = disputeResolverAdminWallet.address;
  const treasury = disputeResolverAdminWallet.address;
  const envName = (opts.env as EnvironmentType) || "testing";
  const defaultConfig = getDefaultConfig(envName);
  const chainId = defaultConfig.chainId;
  const metadataUri = opts.metadata;
  const fees = opts.fees
    ? (opts.fees as string)
        .split(",")
        .map((tupleString) => tupleString.split("/"))
        .map((tuple) => ({
          tokenAddress: tuple[0],
          tokenName: tuple[1],
          feeAmount: tuple[2]
        }))
    : [];
  const sellers = opts.sellers ? (opts.sellers as string).split(",") : [];

  const coreSDKDRAdmin = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      disputeResolverAdminWallet
    ),
    envName
  });
  const protocolAdminWallet = new Wallet(protocolAdminPrivateKey);
  const coreSDKProtocolAdmin = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      protocolAdminWallet
    ),
    envName
  });

  console.log(
    `Creating dispute resolver for address ${disputeResolverAdminWallet.address} on env ${envName} on chain ${chainId}...`
  );
  const txResponse1 = await coreSDKDRAdmin.createDisputeResolver({
    escalationResponsePeriodInMS,
    admin: disputeResolverAdminWallet.address,
    operator,
    clerk,
    treasury,
    metadataUri,
    fees,
    sellerAllowList: sellers
  });
  console.log(`Tx hash: ${txResponse1.hash}`);
  const receipt = await txResponse1.wait();
  const disputeResolverId = coreSDKDRAdmin.getDisputeResolverIdFromLogs(
    receipt.logs
  );
  console.log(`Dispute resolver with id ${disputeResolverId} created.`);

  console.log(`Activating dispute resolver...`);
  const txResponse2 = await coreSDKProtocolAdmin.activateDisputeResolver(
    disputeResolverId as string
  );
  console.log(`Tx hash: ${txResponse2.hash}`);
  await txResponse2.wait();
  console.log(`Dispute resolver with id ${disputeResolverId} activated.`);
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
