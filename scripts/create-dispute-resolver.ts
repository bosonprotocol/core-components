import { Wallet, providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "../packages/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Creates and activates a dispute resolver.")
  .argument("<PROTOCOL_ADMIN_PK>", "Private key of account with ADMIN role.")
  .argument(
    "<DR_ADMIN_ADDRESS>",
    "Admin address of dispute resolver. Same address will be used for clerk, treasury and operator if no overrides set."
  )
  .option("-c, --chain <CHAIN_ID>", "Target chain id", "1234")
  .option(
    "-e, --escalation-period <PERIOD_IN_MS>",
    "Escalation response period in milliseconds."
  )
  .option(
    "-m, --metadata <METADATA_URI>",
    "Metadata URI of dispute resolver.",
    "ipfs://dispute-resolver-uri"
  )
  .option(
    "-f, --fees <...FEES>",
    "Comma-separated list of dispute resolution fee tuples with the format: <TOKEN_ADDRESS>/<TOKEN_NAME>/<FEE_AMOUNT>"
  )
  .option(
    "-s, --sellers <...SELLERS>",
    "Comma-separated list of allowed seller IDs."
  )
  .option(
    "-o, --operator <OPERATOR_ADDRESS>",
    "Operator address to set for dispute resolver."
  )
  .option(
    "-cl, --clerk <CLERK_ADDRESS>",
    "Clerk address to set for dispute resolver."
  )
  .option(
    "-t, --treasury <TREASURY_ADDRESS>",
    "Treasury address to set for dispute resolver."
  )
  .parse(process.argv);

async function main() {
  const [protocolAdminPrivateKey, disputeResolverAdminAddress] = program.args;

  const opts = program.opts();
  const escalationResponsePeriodInMS =
    opts.escalationResponsePeriod || 60_000_000_000;
  const operator = opts.operator || disputeResolverAdminAddress;
  const clerk = opts.clerk || disputeResolverAdminAddress;
  const treasury = opts.treasury || disputeResolverAdminAddress;
  const chainId = Number(opts.chain || "1234");
  const defaultConfig = getDefaultConfig({ chainId });
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

  const protocolAdminWallet = new Wallet(protocolAdminPrivateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      protocolAdminWallet
    ),
    chainId
  });

  console.log(`Creating dispute resolver on chain ${chainId}...`);
  const txResponse1 = await coreSDK.createDisputeResolver({
    escalationResponsePeriodInMS,
    admin: disputeResolverAdminAddress,
    operator,
    clerk,
    treasury,
    metadataUri,
    fees,
    sellerAllowList: sellers
  });
  console.log(`Tx hash: ${txResponse1.hash}`);
  const receipt = await txResponse1.wait();
  const disputeResolverId = coreSDK.getDisputeResolverIdFromLogs(receipt.logs);
  console.log(`Dispute resolver with id ${disputeResolverId} created.`);

  console.log(`Activating dispute resolver...`);
  const txResponse2 = await coreSDK.activateDisputeResolver(
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
