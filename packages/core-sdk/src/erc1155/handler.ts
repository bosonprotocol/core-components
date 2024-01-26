import { Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc1155Iface } from "./interface";
export async function name(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc1155Iface.encodeFunctionData("name");

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [name] = erc1155Iface.decodeFunctionResult("name", result);
  return String(name);
}
export async function symbol(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc1155Iface.encodeFunctionData("symbol");

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [symbol] = erc1155Iface.decodeFunctionResult("symbol", result);
  return String(symbol);
}
export async function uri(args: {
  contractAddress: string;
  tokenId: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc1155Iface.encodeFunctionData("uri", [args.tokenId]);

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [uri] = erc1155Iface.decodeFunctionResult("uri", result);
  return String(uri);
}
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
