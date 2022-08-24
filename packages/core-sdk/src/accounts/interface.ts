import {
  SellerStruct,
  AuthTokenStruct,
  VoucherInitValuesStruct,
  abis,
  DisputeResolverStruct,
  utils
} from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import {
  CreateSellerArgs,
  CreateDisputeResolverArgs,
  DisputeResolutionFee
} from "./types";

export const bosonAccountHandlerIface = new Interface(
  abis.IBosonAccountHandlerABI
);

export function encodeCreateAccount(seller: CreateSellerArgs) {
  const sellerArgs = createSellerArgsToStruct(seller);
  return bosonAccountHandlerIface.encodeFunctionData("createSeller", [
    sellerArgs.sellerStruct,
    sellerArgs.authTokenStruct,
    sellerArgs.voucherInitValues
  ]);
}

export function encodeCreateDisputeResolver(args: CreateDisputeResolverArgs) {
  return bosonAccountHandlerIface.encodeFunctionData("createDisputeResolver", [
    createDisputeResolverArgsToDisputeResolverStruct(args),
    args.fees,
    args.sellerAllowList || []
  ]);
}

export function encodeActivateDisputeResolver(disputeResolverId: BigNumberish) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "activateDisputeResolver",
    [disputeResolverId]
  );
}

export function encodeAddFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "addFeesToDisputeResolver",
    [args.disputeResolverId, args.fees]
  );
}

export function encodeAddSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData("addSellersToAllowList", [
    args.disputeResolverId,
    args.sellerAllowList
  ]);
}

export function encodeRemoveFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "removeFeesFromDisputeResolver",
    [args.disputeResolverId, args.feeTokenAddresses]
  );
}

export function encodeRemoveSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "removeSellersFromAllowList",
    [args.disputeResolverId, args.sellerAllowList]
  );
}

export function encodeUpdateDisputeResolver(
  disputeResolver: DisputeResolverStruct
) {
  return bosonAccountHandlerIface.encodeFunctionData("updateDisputeResolver", [
    disputeResolver
  ]);
}

export function createSellerArgsToStruct(args: CreateSellerArgs): {
  sellerStruct: Partial<SellerStruct>;
  authTokenStruct: AuthTokenStruct;
  voucherInitValues: VoucherInitValuesStruct;
} {
  const {
    authTokenId,
    authTokenType,
    contractUri,
    royaltyPercentage,
    ...sellerStructArgs
  } = args;
  return {
    sellerStruct: {
      // NOTE: It doesn't matter which values we set for `id` and `active` here
      // as they will be overridden by the contract. But to conform to the struct
      // we need to set some arbitrary values.
      id: "0",
      active: true,
      ...sellerStructArgs
    },
    authTokenStruct: {
      tokenId: authTokenId,
      tokenType: authTokenType
    },
    voucherInitValues: {
      contractURI: contractUri,
      royaltyPercentage
    }
  };
}

function createDisputeResolverArgsToDisputeResolverStruct(
  args: CreateDisputeResolverArgs
): DisputeResolverStruct {
  return {
    // NOTE: It doesn't matter which values we set for `id` and `active` here
    // as they will be overridden by the contract. But to conform to the struct
    // we need to set some arbitrary values.
    id: "0",
    active: true,
    ...args,
    escalationResponsePeriod: utils.timestamp.msToSec(
      args.escalationResponsePeriodInMS
    )
  };
}
