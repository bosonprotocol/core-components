import { TransactionResponse, Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import {
  decodeGetAvailablePreMints,
  decodeGetRangeByOfferId,
  encodeBurnPremintedVouchers,
  encodeGetAvailablePreMints,
  encodeGetRangeByOfferId,
  encodePreMint
} from "./interface";

export async function burnPremintedVouchers(args: {
  offerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeBurnPremintedVouchers(args.offerId)
  });
}

export async function getAvailablePreMints(args: {
  offerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetAvailablePreMints(args.offerId)
  });
  const [count] = decodeGetAvailablePreMints(result);
  return String(count);
}

export async function getRangeByOfferId(args: {
  offerId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<unknown> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetRangeByOfferId(args.offerId)
  });
  const [range] = decodeGetRangeByOfferId(result);
  return range as unknown; // TODO: create type and import it from @bosonprotocol/common
}

export async function preMint(args: {
  offerId: BigNumberish;
  amount: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodePreMint(args.offerId, args.amount)
  });
}
