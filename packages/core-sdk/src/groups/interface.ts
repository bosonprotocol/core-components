import {
  abis,
  CreateGroupArgs,
  GroupStruct,
  ConditionStruct
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const bosonGroupHandlerIface = new Interface(abis.IBosonGroupHandlerABI);

export function encodeCreateGroup(args: CreateGroupArgs) {
  return bosonGroupHandlerIface.encodeFunctionData(
    "createGroup",
    createGroupArgsToStructs(args)
  );
}

export function createGroupArgsToStructs(
  args: CreateGroupArgs
): [GroupStruct, Omit<ConditionStruct, "gatingType"> & { gating: number }] {
  return [
    {
      id: "0",
      sellerId: args.sellerId,
      offerIds: args.offerIds
    },
    conditionArgsToStructs(args)
  ];
}

export function conditionArgsToStructs(
  args: ConditionStruct
): Omit<ConditionStruct, "gatingType"> & { gating: number } {
  return {
    method: args.method,
    tokenType: args.tokenType,
    tokenAddress: args.tokenAddress,
    gating: args.gatingType,
    minTokenId: args.minTokenId,
    maxTokenId: args.maxTokenId,
    threshold: args.threshold,
    maxCommits: args.maxCommits
  };
}
