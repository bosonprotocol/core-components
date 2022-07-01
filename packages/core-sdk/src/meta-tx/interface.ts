import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const metaTransactionsHandlerIface = new Interface(
  abis.IBosonMetaTransactionsHandlerABI
);
