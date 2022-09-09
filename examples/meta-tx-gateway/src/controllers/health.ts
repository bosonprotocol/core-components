import { Request, Response } from "express";

import * as healthService from "../services/health";
import { getConfig } from "../config";

import { ApiError } from "../errors/ApiError";

export async function getHealthStatus(req: Request, res: Response) {
  return res.send({ healthy: true });
}

export async function getReadyStatus(req: Request, res: Response) {
  try {
    const config = getConfig();
    await healthService.checkWeb3({
      chainId: config.CHAIN_ID,
      rpcNode: config.RPC_NODE
    });
  } catch (error) {
    throw new ApiError(
      500,
      `Web3 is not connected! ${error.reason || error.code}`
    );
  }

  return res.send({ ready: true });
}
