import { EnvironmentType } from "./../packages/common/src/types/configs";
import { isAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { Wallet, providers } from "ethers";
import { InvalidArgumentError, program } from "commander";
import { CoreSDK, getDefaultConfig } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

function validAddress(value) {
  if (!isAddress(value)) {
    throw new InvalidArgumentError("Not an address.");
  }
  return value;
}

function validBigNumber(value) {
  let parsedValue;
  try {
    parsedValue = BigNumber.from(value);
  } catch (e) {
    throw new InvalidArgumentError("Cannot be cast as a BigNumber.");
  }
  return parsedValue;
}

function validPrivateKey(value) {
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(value)) {
    throw new InvalidArgumentError("Cannot be cast as a private key.");
  }
  return value;
}

program
  .description("Deposit funds.")
  .requiredOption("-k, --key <privateKey>", "Private Key.", validPrivateKey)
  .requiredOption("-e , --env <envName>", "Environment.")
  .requiredOption("-s, --sellerId <sellerId>", "Seller ID.", validBigNumber)
  .requiredOption("-v, --value <value>", "Value.", validBigNumber)
  .option("-t, --token <token>", "Token Address.", validAddress)
  .parse(process.argv);

async function main() {
  const {
    key: privateKey,
    env: envName,
    sellerId,
    value,
    token
  } = program.opts();
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
  const chainId = defaultConfig.chainId;
  const wallet = new Wallet(privateKey);
  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl),
      wallet
    ),
    envName
  });
  console.log(`*********************`);
  console.log(`   Deposit Funds`);
  console.log(`*********************`);
  console.log(`Operator: ${wallet.address}`);
  console.log(`Environment: ${envName}`);
  console.log(`ChainId: ${chainId}`);
  console.log(`SellerId: ${sellerId.toString()}`);
  console.log(`Value: ${value.toString()}`);
  console.log(`Token: ${token ?? defaultConfig.nativeCoin?.name + "(Native)"}`);
  console.log(`*********************`);
  const tx = await coreSDK.depositFunds(sellerId, value, token);
  console.log("Tx pending", tx.hash, "...");
  await tx.wait();
  console.log("Tx executed", tx.hash);
  console.log(`*********************`);
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
