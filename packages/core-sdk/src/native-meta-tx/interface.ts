import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const nativeMetaTransactionsIface = new Interface(
  abis.NativeMetaTransactionABI
);
