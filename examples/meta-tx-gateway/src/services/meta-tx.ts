import { logger } from "./../utils/logger";
import { TransactionResponse } from "@ethersproject/abstract-provider";
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
    const tx: TransactionResponse =
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
