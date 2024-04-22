import { ethers as ethersV6 } from "ethers-v6";

export async function getProvider(
  rpcNode: string
): Promise<ethersV6.JsonRpcProvider> {
  const provider = await new ethersV6.JsonRpcProvider(rpcNode);
  return provider;
}
