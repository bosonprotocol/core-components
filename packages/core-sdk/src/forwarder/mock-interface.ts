import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const abi = abis.MockForwarderABI;
const forwarderInterface = new Interface(abi);

export function encodeGetNonce(signerAddress: BigNumberish) {
  return forwarderInterface.encodeFunctionData("getNonce", [signerAddress]);
}

export function decodeGetNonce(result: string) {
  return forwarderInterface.decodeFunctionResult("getNonce", result);
}
