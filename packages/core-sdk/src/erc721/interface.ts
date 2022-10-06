import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const erc721Iface = new Interface(abis.ERC721EnumerableABI);
