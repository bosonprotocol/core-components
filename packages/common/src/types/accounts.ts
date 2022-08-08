import { BigNumberish } from "@ethersproject/bignumber";

export type CreateSellerArgs = {
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  contractUri: string;
  authTokenId: BigNumberish;
  authTokenType: number;
};

export type SellerStruct = {
  id: BigNumberish;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  voucherCloneAddress: string;
  authTokenId: BigNumberish;
  authTokenType: number;
  active: boolean;
};

export type AuthTokenStruct = {
  tokenId: BigNumberish;
  tokenType: number;
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
