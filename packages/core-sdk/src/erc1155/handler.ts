import { Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc1155Iface } from "./interface";

export async function balanceOf(args: {
  contractAddress: string;
  tokenId: BigNumberish;
  owner: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc1155Iface.encodeFunctionData("balanceOf", [
      args.owner,
      args.tokenId
    ])
  });

  const [balance] = erc1155Iface.decodeFunctionResult("balanceOf", result);
  return String(balance);
}
