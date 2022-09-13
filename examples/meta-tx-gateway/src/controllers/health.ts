import { NextFunction, Request, Response } from "express";

import * as healthService from "../services/health";
import { getConfig } from "../config";

export async function getHealthStatus(req: Request, res: Response) {
  return res.send({ healthy: true });
}

export async function getReadyStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const config = getConfig();
    await healthService.checkWeb3({
      chainId: config.CHAIN_ID,
      rpcNode: config.RPC_NODE
    });
    return res.send({ ready: true });
  } catch (error) {
    next(error);
  }
}
