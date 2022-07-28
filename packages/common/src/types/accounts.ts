import { BigNumberish } from "@ethersproject/bignumber";

export type CreateSellerArgs = {
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  contractUri: string;
};

export type SellerStruct = {
  id: BigNumberish;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
};

export type DisputeResolverStruct = {
  id: BigNumberish;
  escalationResponsePeriod: BigNumberish;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  metadataUri: string;
  active: boolean;
};
