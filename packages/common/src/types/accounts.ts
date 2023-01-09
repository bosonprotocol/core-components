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

export const SellerUpdateFields = {
  admin: 0,
  operator: 1,
  clerk: 2,
  authToken: 3
};

export type OptInToSellerUpdateArgs = {
  id: BigNumberish;
  fieldsToUpdate: {
    admin?: boolean;
    operator?: boolean;
    clerk?: boolean;
    authToken?: boolean;
  };
};

export const DisputeResolverUpdateFields = {
  admin: 0,
  operator: 1,
  clerk: 2
};

export type OptInToDisputeResolverUpdateArgs = {
  id: BigNumberish;
  fieldsToUpdate: {
    admin?: boolean;
    operator?: boolean;
    clerk?: boolean;
  };
};

export const AuthTokenType = {
  NONE: 0,
  CUSTOM: 1,
  LENS: 2,
  ENS: 3
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
