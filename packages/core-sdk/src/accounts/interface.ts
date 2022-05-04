import { SellerStruct, abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { CreateSellerArgs } from "./types";

export const bosonAccountHandlerIface = new Interface(
  abis.IBosonAccountHandlerABI
);

export function createSellerArgsToStruct(
  args: CreateSellerArgs
): Partial<SellerStruct> {
  return {
    id: "0",
    active: true,
    ...args
  };
}
