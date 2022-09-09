import { ethers } from "ethers";

export async function getProvider(
  rpcNode: string
): Promise<ethers.providers.Provider> {
  const provider = await new ethers.providers.JsonRpcProvider(rpcNode);
  return provider;
}

export async function getSigner(
  rpcNode: string,
  privateKey: string
): Promise<ethers.Signer> {
  const provider = await getProvider(rpcNode);
  const wallet = new ethers.Wallet(privateKey).connect(provider);
  return wallet;
}
