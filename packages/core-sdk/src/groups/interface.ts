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
): [GroupStruct, ConditionStruct] {
  return [
    {
      id: "0",
      sellerId: "0",
      offerIds: args.offerIds
    },
    {
      method: args.method,
      tokenType: args.tokenType,
      tokenAddress: args.tokenAddress,
      tokenId: args.tokenId,
      threshold: args.threshold,
      maxCommits: args.maxCommits
    }
  ];
}
