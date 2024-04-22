import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";

const seaportIface = new Interface(abis.SeaportABI);

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
  ERC1155_WITH_CRITERIA = 5
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

export type AdvancedOrder = Order & {
  numerator: BigNumberish;
  denominator: BigNumberish;
  extraData: string;
};

export enum Side {
  OFFER = 0, // items that can be spent
  CONSIDERATION = 1 // items that must be received
}

export type CriteriaResolver = {
  orderIndex: BigNumberish;
  side: number;
  index: BigNumberish;
  identifier: BigNumberish;
  criteriaProof: string[];
};

export type Fulfillment = {
  offerComponents: FulfillmentComponent[];
  considerationComponents: FulfillmentComponent[];
};

export type FulfillmentComponent = {
  orderIndex: BigNumberish;
  itemIndex: BigNumberish;
};

export function encodeValidate(orders: Order[]) {
  return seaportIface.encodeFunctionData("validate", [orders]);
}

export function encodeMatchAdvancedOrders(
  advancedOrders: AdvancedOrder[],
  criteriaResolvers: CriteriaResolver[],
  fulfillments: Fulfillment[],
  recipient: string
) {
  return seaportIface.encodeFunctionData("matchAdvancedOrders", [
    advancedOrders,
    criteriaResolvers,
    fulfillments,
    recipient
  ]);
}
