import { ethers as ethersV6 } from "ethers-v6";

export async function getProvider(
  rpcNode: string
): Promise<ethersV6.JsonRpcProvider> {
  const provider = await new ethersV6.JsonRpcProvider(rpcNode);
  return provider;
}

// export async function getSigner(
//   rpcNode: string,
//   privateKey: string
// ): Promise<ethersV6.Signer> {
//   const provider = await getProvider(rpcNode);
//   const wallet = new ethersV6.Wallet(privateKey).connect(provider);
//   return wallet;
// }
