import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const abi = abis.BiconomyForwarderABI;
const forwarderInterface = new Interface(abi);

export type ERC20ForwardRequest = {
  from: BigNumberish;
  to: BigNumberish;
  token: BigNumberish;
  txGas: BigNumberish;
  tokenGasPrice: string;
  batchId: BigNumberish;
  batchNonce: BigNumberish;
  deadline: number;
  data: string;
};

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

export function encodeVerifyEIP712(
  request: ERC20ForwardRequest,
  domainSeparator: string,
  signature: string
) {
  return forwarderInterface.encodeFunctionData("verifyEIP712", [
    request,
    domainSeparator,
    signature
  ]);
}

export function decodeVerifyEIP712(result: string) {
  return forwarderInterface.decodeFunctionResult("verifyEIP712", result);
}
