import { logger } from "./../utils/logger";
import { ContractTransaction } from "ethers";
import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { ethers } from "ethers";
import { getConfig } from "../config";
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
  const protocolAddress = config.PROTOCOL;
  if (body.to.toLowerCase() !== protocolAddress.toLowerCase()) {
    logger.error(
      `Targeted contract ${body.to} is not the one expected (${protocolAddress})`
    );
    throw {
      code: "12345", // TODO: get the codes
      message: `Targeted contract ${body.to} is not the one expected (${protocolAddress})`
    };
  }
  const bosonMetaTransactionsHandler = new ethers.Contract(
    protocolAddress,
    new Interface(abis.IBosonMetaTransactionsHandlerABI),
    signer
  );
  logger.info(
    `Relay Meta Transaction to Contract ${protocolAddress}, params: ${JSON.stringify(
      body
    )}`
  );
  try {
    const tx: ContractTransaction =
      await bosonMetaTransactionsHandler.executeMetaTransaction(...body.params);
    const txReceipt = await tx.wait();
    return {
      txHash: txReceipt.transactionHash,
      to: txReceipt.to,
      from: txReceipt.from,
      events: txReceipt.events.map((event) => JSON.stringify(event)) // events does not exist in Biconomy return (only added for tests)
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
