import { BigNumberish } from "@ethersproject/bignumber";
import { DisputeResolverStruct } from "@bosonprotocol/common";

export {
  CreateSellerArgs,
  UpdateSellerArgs,
  SellerStruct,
  AuthTokenStruct,
  VoucherInitValuesStruct,
  abis,
  DisputeResolverStruct,
  SellerUpdateFields,
  OptInToSellerUpdateArgs,
  DisputeResolverUpdateFields,
  OptInToDisputeResolverUpdateArgs,
  utils
} from "@bosonprotocol/common";

export type CreateDisputeResolverArgs = {
  escalationResponsePeriodInMS: number;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  metadataUri: string;
  /**
   * List of supported fees. Should contain at lest one element.
   */
  fees: DisputeResolutionFee[];
  /**
   * Ids of sellers that are allowed to use the dispute resolver.
   * If empty or `undefined`, then any seller can use the dispute resolver.
   */
  sellerAllowList?: BigNumberish[];
};

export type DisputeResolutionFee = {
  tokenAddress: string;
  tokenName: string;
  feeAmount: BigNumberish;
};

export type DisputeResolverUpdates = Partial<
  Omit<DisputeResolverStruct, "id" | "active" | "escalationResponsePeriod"> & {
    escalationResponsePeriodInMS: BigNumberish;
  }
>;
