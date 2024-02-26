import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const bosonConfigHandlerIface = new Interface(
  abis.IBosonConfigHandlerABI
);

export function encodeGetMaxRoyaltyPercentage(): string {
  return bosonConfigHandlerIface.encodeFunctionData("getMaxRoyaltyPercentage");
}

export function decodeGetMaxRoyaltyPercentage(result: string): number {
  const [maxRoyaltyPercentage] = bosonConfigHandlerIface.decodeFunctionResult(
    "getMaxRoyaltyPercentage",
    result
  );
  return Number(maxRoyaltyPercentage);
}
