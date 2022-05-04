import { BigNumberish } from "@ethersproject/bignumber";

export type CreateSellerArgs = {
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
};

export type SellerStruct = {
  id: BigNumberish;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
};
