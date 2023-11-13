import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const erc165Iface = new Interface(abis.ERC165ABI);
