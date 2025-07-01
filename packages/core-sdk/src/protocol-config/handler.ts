import { Web3LibAdapter } from "@bosonprotocol/common";
import {
  encodeGetMaxRoyaltyPercentage,
  decodeGetMaxRoyaltyPercentage
} from "./interface";

// Overload: returnTxInfo is true → returns call request
export async function getMaxRoyaltyPercentage(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo: true;
}): Promise<{ to: string; data: string }>;

// Overload: returnTxInfo is false or undefined → returns number
export async function getMaxRoyaltyPercentage(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: false | undefined;
}): Promise<number>;

// Implementation
export async function getMaxRoyaltyPercentage(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  returnTxInfo?: boolean;
}): Promise<number | { to: string; data: string }> {
  const callRequest = {
    to: args.contractAddress,
    data: encodeGetMaxRoyaltyPercentage()
  };

  if (args.returnTxInfo) {
    return callRequest;
  } else {
    const result = await args.web3Lib.call(callRequest);
    return decodeGetMaxRoyaltyPercentage(result);
  }
}
