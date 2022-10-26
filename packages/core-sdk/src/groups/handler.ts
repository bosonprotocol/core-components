import {
  TransactionResponse,
  CreateGroupArgs,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { encodeCreateGroup } from "./interface";

export async function createGroup(args: {
  groupToCreate: CreateGroupArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateGroup(args.groupToCreate)
  });
}
