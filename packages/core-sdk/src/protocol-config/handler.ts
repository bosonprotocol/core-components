import { Web3LibAdapter } from "@bosonprotocol/common";
import {
  encodeGetMaxRoyaltyPercentage,
  decodeGetMaxRoyaltyPercentage
} from "./interface";

export async function getMaxRoyaltyPercentage(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<number> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetMaxRoyaltyPercentage()
  });
  return decodeGetMaxRoyaltyPercentage(result);
}
