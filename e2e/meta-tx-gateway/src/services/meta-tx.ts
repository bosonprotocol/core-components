import { logger } from "./../utils/logger";
import { ContractTransaction } from "ethers";
import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { ethers } from "ethers";
import { Config, getConfig } from "../config";
import { getSigner } from "../utils/web3";

export type PostMetaTxBody = {
  to: string;
  apiId: string;
  params: unknown[];
  from: string;
};

export async function postMetaTx(body: PostMetaTxBody) {
  const config = getConfig();
  const signer = await getSigner(config.RPC_NODE, config.PRIVATE_KEY);
  if (body.to.toLowerCase() === config.PROTOCOL.toLowerCase()) {
    return toBosonProtocol(config, signer, body);
  }
  if (body.to.toLowerCase() === config.ERC20.toLowerCase()) {
    return toErc20(config, signer, body);
  }
  logger.error(
    `Targeted contract ${body.to} is neither protocol (${config.PROTOCOL}) nor testErc20 (${config.ERC20})`
  );
  throw {
    code: "12345", // TODO: get the codes
    message: `Targeted contract ${body.to} is neither protocol (${config.PROTOCOL}) nor testErc20 (${config.ERC20})`
  };
}

async function toErc20(
  config: Config,
  signer: ethers.Signer,
  body: PostMetaTxBody
) {
  logger.info(
    `Relay Meta Transaction to Erc20 Contract ${
      body.to
    }, params: ${JSON.stringify(body)}`
  );
  const erc20Address = config.ERC20;
  const nativeMetaTransactions = new ethers.Contract(
    erc20Address,
    new Interface(abis.NativeMetaTransactionABI),
    signer
  );
  try {
    const tx: ContractTransaction =
      await nativeMetaTransactions.executeMetaTransaction(...body.params);
    const txReceipt = await tx.wait();
    return {
      txHash: txReceipt.transactionHash,
      to: txReceipt.to,
      from: txReceipt.from
    };
  } catch (e) {
    logger.error(`Transaction failed ${JSON.stringify(e)}`);
    throw {
      code: e.code || "12345", // TODO: get the codes
      message: e.toString()
    };
  }
}

async function toBosonProtocol(
  config: Config,
  signer: ethers.Signer,
  body: PostMetaTxBody
) {
  logger.info(
    `Relay Meta Transaction to Protocol Contract ${
      body.to
    }, params: ${JSON.stringify(body)}`
  );
  const protocolAddress = config.PROTOCOL;
  const bosonMetaTransactionsHandler = new ethers.Contract(
    protocolAddress,
    new Interface(abis.IBosonMetaTransactionsHandlerABI),
    signer
  );
  try {
    const tx: ContractTransaction =
      await bosonMetaTransactionsHandler.executeMetaTransaction(...body.params);
    const txReceipt = await tx.wait();
    return {
      txHash: txReceipt.transactionHash,
      to: txReceipt.to,
      from: txReceipt.from
    };
  } catch (e) {
    logger.error(`Transaction failed ${JSON.stringify(e)}`);
    throw {
      code: e.code || "12345", // TODO: get the codes
      message: e.toString()
    };
  }
}

export async function getResubmitted(transactionHash: string) {
  return {
    code: "200",
    message: "Use this new hash to serve to your users",
    data: {
      oldHash: transactionHash,
      newHash: transactionHash,
      oldGasPrice: "100000000000",
      newGasPrice: 100000000000,
      timestamp: 1628876034979,
      retryCount: 0,
      relayerAddress: "0xa2fbe95f1049404a71ae60d719597e596eb07c23",
      newStatus: "CONFIRMED"
    }
  };
}
