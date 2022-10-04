import { BigNumberish } from "@ethersproject/bignumber";

export type CreateSellerArgs = {
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  contractUri: string;
  royaltyPercentage: BigNumberish;
  authTokenId: BigNumberish;
  authTokenType: number;
};

export type UpdateSellerArgs = { id: BigNumberish } & Omit<
  CreateSellerArgs,
  "contractUri" | "royaltyPercentage"
>;

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

export type VoucherInitValuesStruct = {
  contractURI: string;
  royaltyPercentage: BigNumberish;
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
