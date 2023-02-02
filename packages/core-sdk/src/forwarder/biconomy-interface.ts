import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const abi = abis.BiconomyForwarderABI;
const forwarderInterface = new Interface(abi);

export function encodeGetNonce(
  signerAddress: BigNumberish,
  batchId: BigNumberish
) {
  return forwarderInterface.encodeFunctionData("getNonce", [
    signerAddress,
    batchId
  ]);
}

export function decodeGetNonce(result: string) {
  return forwarderInterface.decodeFunctionResult("getNonce", result);
}
