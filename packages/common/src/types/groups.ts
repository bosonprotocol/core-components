import { BigNumberish } from "@ethersproject/bignumber";

export type GroupStruct = {
  id: BigNumberish;
  sellerId: BigNumberish;
  offerIds: BigNumberish[];
};

export enum EvaluationMethod {
  None = 0,
  Threshold = 1,
  SpecificToken = 2
}

export enum TokenType {
  FungibleToken = 0,
  NonFungibleToken = 1,
  MultiToken = 2
}

export type ConditionStruct = {
  method: number; // EvaluationMethod
  tokenType: number; // TokenType
  tokenAddress: string;
  tokenId: BigNumberish;
  threshold: BigNumberish;
  maxCommits: BigNumberish;
};

export type CreateGroupArgs = ConditionStruct & {
  offerIds: BigNumberish[];
};
