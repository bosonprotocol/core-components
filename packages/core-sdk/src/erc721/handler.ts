import { Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc721Iface } from "./interface";

export async function name(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc721Iface.encodeFunctionData("name");

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [name] = erc721Iface.decodeFunctionResult("name", result);
  return String(name);
}
export async function symbol(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc721Iface.encodeFunctionData("symbol");

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [symbol] = erc721Iface.decodeFunctionResult("symbol", result);
  return String(symbol);
}
export async function tokenUri(args: {
  contractAddress: string;
  tokenId: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc721Iface.encodeFunctionData("tokenURI", [args.tokenId]);

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [tokenUri] = erc721Iface.decodeFunctionResult("tokenURI", result);
  return String(tokenUri);
}
export async function balanceOf(args: {
  contractAddress: string;
  owner: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const data = erc721Iface.encodeFunctionData("balanceOf", [args.owner]);

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: data
  });

  const [balance] = erc721Iface.decodeFunctionResult("balanceOf", result);
  return String(balance);
}

export async function ownerOf(args: {
  contractAddress: string;
  tokenId: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc721Iface.encodeFunctionData("ownerOf", [args.tokenId])
  });

  const [owner] = erc721Iface.decodeFunctionResult("ownerOf", result);
  return String(owner);
}

export async function tokenOfOwnerByIndex(args: {
  contractAddress: string;
  owner: string;
  index: BigNumberish;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc721Iface.encodeFunctionData("tokenOfOwnerByIndex", [
      args.owner,
      args.index
    ])
  });

  const [tokenId] = erc721Iface.decodeFunctionResult(
    "tokenOfOwnerByIndex",
    result
  );
  return String(tokenId);
}
