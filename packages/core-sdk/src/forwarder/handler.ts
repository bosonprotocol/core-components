import { Web3LibAdapter, abis } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import * as mockInterface from "./mock-interface";
import * as biconomyInterface from "./biconomy-interface";

export async function getNonce(args: {
  contractAddress: string;
  user: string;
  web3Lib: Web3LibAdapter;
  batchId: BigNumberish;
  forwarderAbi: typeof abis.MockForwarderABI | typeof abis.BiconomyForwarderABI;
}): Promise<string> {
  const isMock = args.forwarderAbi === mockInterface.abi;
  const data = isMock
    ? mockInterface.encodeGetNonce(args.user)
    : biconomyInterface.encodeGetNonce(args.user, args.batchId);

  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data
  });
  const nonceResult = isMock
    ? mockInterface.decodeGetNonce(result)
    : biconomyInterface.decodeGetNonce(result);
  const [nonce] = nonceResult;
  return String(nonce);
}
