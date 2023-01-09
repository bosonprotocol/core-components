import { logger } from "../utils/logger";
import { getProvider } from "../utils/web3";

export async function checkWeb3(params: {
  chainId: number;
  rpcNode: string;
}): Promise<boolean> {
  const provider = await getProvider(params.rpcNode);
  const network = await provider.getNetwork();
  if (network.chainId !== params.chainId) {
    throw {
      reason: `RpcNode chainId does not match. Received: ${network.chainId}. Expected: ${params.chainId}`
    };
  }
  logger.info(`Network: ${JSON.stringify(network)}`);
  return true;
}
