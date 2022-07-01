import { Web3LibAdapter, TransactionResponse } from "@bosonprotocol/common";
import { encodeCreateAccount } from "./interface";

import { CreateSellerArgs } from "../accounts/types";

export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateAccount(args.sellerToCreate)
  });
}
