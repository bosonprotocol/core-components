import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

export const bosonVoucherIface = new Interface(abis.IBosonVoucherABI);

export function encodeBurnPremintedVouchers(
  offerId: BigNumberish,
  amount: BigNumberish
) {
  return bosonVoucherIface.encodeFunctionData("burnPremintedVouchers", [
    offerId,
    amount
  ]);
}

export function encodeGetAvailablePreMints(offerId: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("getAvailablePreMints", [
    offerId
  ]);
}

export function decodeGetAvailablePreMints(result: string) {
  return bosonVoucherIface.decodeFunctionResult("getAvailablePreMints", result);
}

export function encodeIsApprovedForAll(owner: string, operator: string) {
  return bosonVoucherIface.encodeFunctionData("isApprovedForAll", [
    owner,
    operator
  ]);
}

export function decodeIsApprovedForAll(result: string) {
  return bosonVoucherIface.decodeFunctionResult("isApprovedForAll", result);
}

export function encodeGetRangeByOfferId(offerId: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("getRangeByOfferId", [offerId]);
}

export function decodeGetRangeByOfferId(result: string) {
  return bosonVoucherIface.decodeFunctionResult("getRangeByOfferId", result);
}

export function encodePreMint(offerId: BigNumberish, amount: BigNumberish) {
  return bosonVoucherIface.encodeFunctionData("preMint", [offerId, amount]);
}

export function encodeSetApprovalForAll(operator: string, approved: boolean) {
  return bosonVoucherIface.encodeFunctionData("setApprovalForAll", [
    operator,
    approved
  ]);
}

export function encodeTransferFrom(
  from: BigNumberish,
  to: BigNumberish,
  tokenId: BigNumberish
) {
  return bosonVoucherIface.encodeFunctionData("transferFrom", [
    from,
    to,
    tokenId
  ]);
}

export function encodeCallExternalContract(to: string, data: string) {
  return bosonVoucherIface.encodeFunctionData("callExternalContract", [
    to,
    data
  ]);
}

export function encodeSetApprovalForAllToContract(
  operator: string,
  approved: boolean
) {
  return bosonVoucherIface.encodeFunctionData("setApprovalForAllToContract", [
    operator,
    approved
  ]);
}

export function encodeWithdrawToProtocol(tokenList: string[]) {
  return bosonVoucherIface.encodeFunctionData("withdrawToProtocol", [
    tokenList
  ]);
}

export function encodeSetContractURI(contractURI: string) {
  return bosonVoucherIface.encodeFunctionData("setContractURI", [contractURI]);
}

const ownableIface = new Interface([
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
]);

export function encodeOwner() {
  return ownableIface.encodeFunctionData("owner");
}

export function decodeOwner(result: string): string {
  const [owner] = ownableIface.decodeFunctionResult("owner", result);
  return owner;
}

const eRC2771ContextIface = new Interface([
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address"
      }
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
]);

export function encodeIsTrustedForwarder(forwarder: string) {
  return eRC2771ContextIface.encodeFunctionData("isTrustedForwarder", [
    forwarder
  ]);
}

export function decodeIsTrustedForwarder(result: string): boolean {
  const [isTrustedForwarder] = eRC2771ContextIface.decodeFunctionResult(
    "isTrustedForwarder",
    result
  );
  return isTrustedForwarder;
}
