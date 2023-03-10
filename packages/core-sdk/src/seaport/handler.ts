import { BigNumberish } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import { seaportAbi } from "./abi";

const seaportIface = new Interface(seaportAbi);

export enum eOrderType {
  FULL_OPEN = 0,
  PARTIAL_OPEN = 1,
  FULL_RESTRICTED = 2,
  PARTIAL_RESTRICTED = 3,
  CONTRACT = 4
}

export enum eItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA
}

type OfferItem = {
  itemType: eItemType;
  token: string;
  identifierOrCriteria: BigNumberish;
  startAmount: BigNumberish;
  endAmount: BigNumberish;
};

type ConsiderationItem = OfferItem & {
  recipient: string;
};

type OrderParameters = {
  offerer: string;
  zone: string;
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderType: eOrderType;
  startTime: BigNumberish;
  endTime: BigNumberish;
  zoneHash: string;
  salt: BigNumberish;
  conduitKey: string;
  totalOriginalConsiderationItems: BigNumberish;
};

export type Order = {
  parameters: OrderParameters;
  signature: string;
};

export function encodeValidate(orders: Order[]) {
  return seaportIface.encodeFunctionData("validate", [orders]);
}
