import { EnvironmentType, ConfigId } from "@bosonprotocol/common";
import { isAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { Wallet, providers } from "ethers";
import { InvalidArgumentError, Command } from "commander";
import { CoreSDK, getEnvConfigById } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";

function validAddress(value: string): string {
  if (!isAddress(value)) {
    throw new InvalidArgumentError("Not a valid Ethereum address.");
  }
  return value;
}

function validBigNumber(value: string): BigNumber {
  try {
    return BigNumber.from(value);
  } catch {
    throw new InvalidArgumentError("Cannot be cast as a BigNumber.");
  }
}

function validPrivateKey(value: string): string {
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(value)) {
    throw new InvalidArgumentError("Cannot be cast as a private key.");
  }
  return value;
}

export const depositFundsCommand = new Command("deposit-funds")
  .description("Deposit funds into the Boson Protocol for a Seller.")
  .requiredOption(
    "-k, --key <privateKey>",
    "Private key of the account issuing the transaction. Overrides PRIVATE_KEY env var.",
    (v) => validPrivateKey(v)
  )
  .requiredOption(
    "-e, --env <envName>",
    "Target environment (testing|staging|production). Overrides ENV_NAME env var."
  )
  .option(
    "-c, --configId <configId>",
    "Config id. Overrides ENV_CONFIG_ID env var.",
    "testing-80002-0"
  )
  .requiredOption("-s, --sellerId <sellerId>", "Seller ID.", (v) =>
    validBigNumber(v)
  )
  .requiredOption("-v, --value <value>", "Value to deposit.", (v) =>
    validBigNumber(v)
  )
  .option(
    "-t, --token <token>",
    "Token Address (omit for native token).",
    (v) => validAddress(v)
  )
  .action(async (opts) => {
    const privateKey: string = opts.key || process.env.PRIVATE_KEY || "";
    const envName: string = opts.env || process.env.ENV_NAME || "testing";
    const configId: string =
      opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
    const { sellerId, value, token } = opts;

    const defaultConfig = getEnvConfigById(
      envName as EnvironmentType,
      configId as ConfigId
    );
    const chainId = defaultConfig.chainId;
    const wallet = new Wallet(privateKey);
    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new EthersAdapter(
        new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
        wallet
      ),
      envName: envName as EnvironmentType,
      configId: configId as ConfigId
    });

    console.log(`*********************`);
    console.log(`   Deposit Funds`);
    console.log(`*********************`);
    console.log(`Operator: ${wallet.address}`);
    console.log(`Environment: ${envName}`);
    console.log(`ChainId: ${chainId}`);
    console.log(`SellerId: ${sellerId.toString()}`);
    console.log(`Value: ${value.toString()}`);
    console.log(
      `Token: ${token ?? defaultConfig.nativeCoin?.name + " (Native)"}`
    );
    console.log(`*********************`);

    const tx = await coreSDK.depositFunds(sellerId, value, token);
    console.log("Tx pending", tx.hash, "...");
    await tx.wait();
    console.log("Tx executed", tx.hash);
    console.log(`*********************`);
  });
