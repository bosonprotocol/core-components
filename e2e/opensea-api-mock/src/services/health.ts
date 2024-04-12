import { BigNumber } from "ethers";
import { logger } from "../utils/logger";
import { getProvider } from "../utils/web3";

export async function checkWeb3(params: {
  chainId: number;
  rpcNode: string;
}): Promise<boolean> {
  const provider = await getProvider(params.rpcNode);
  const network = await provider.getNetwork();
  const networkChainId = BigNumber.from(network.chainId);
  if (!networkChainId.eq(params.chainId)) {
    throw {
      reason: `RpcNode chainId does not match. Received: ${networkChainId.toString()}. Expected: ${
        params.chainId
      }`
    };
  }
  logger.info(`Network: ${JSON.stringify(network)}`);
  return true;
}
