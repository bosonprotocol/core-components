import { Interface } from "@ethersproject/abi";
import { formatBytes32String } from "@ethersproject/strings";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import {
  CreateSellerArgs,
  CreateDisputeResolverArgs,
  DisputeResolutionFee,
  SellerStruct,
  AuthTokenStruct,
  VoucherInitValuesStruct,
  abis,
  DisputeResolverStruct,
  utils,
  UpdateSellerArgs,
  OptInToSellerUpdateArgs,
  SellerUpdateFields,
  OptInToDisputeResolverUpdateArgs,
  DisputeResolverUpdateFields,
  CreateCollectionArgs,
  RoyaltyRecipientInfo
} from "./types";
import { AddressZero } from "@ethersproject/constants";
import { INITIAL_COLLECTION_ID } from "./handler";

export const bosonAccountHandlerIface = new Interface(
  abis.IBosonAccountHandlerABI
);

export function encodeCreateSeller(
  seller: CreateSellerArgs,
  collectionSalt: string
) {
  const sellerArgs = createSellerArgsToStruct(seller, collectionSalt);
  return bosonAccountHandlerIface.encodeFunctionData("createSeller", [
    sellerArgs.sellerStruct,
    sellerArgs.authTokenStruct,
    sellerArgs.voucherInitValues
  ]);
}

export function encodeCreateNewCollection(collection: CreateCollectionArgs) {
  const collectionArgs = createCollectionArgsToStruct(collection);
  return bosonAccountHandlerIface.encodeFunctionData("createNewCollection", [
    collectionArgs.externalId,
    collectionArgs.voucherInitValues
  ]);
}

export function encodeUpdateSeller(seller: UpdateSellerArgs) {
  const sellerArgs = updateSellerArgsToStruct(seller);
  return bosonAccountHandlerIface.encodeFunctionData("updateSeller", [
    sellerArgs.sellerStruct,
    sellerArgs.authTokenStruct
  ]);
}

export function encodeOptInToSellerUpdate(seller: OptInToSellerUpdateArgs) {
  const fieldsToUpdate: number[] = [];
  Object.entries(SellerUpdateFields).forEach(
    ([key, value]: [string, number]) => {
      if (seller.fieldsToUpdate[key]) {
        fieldsToUpdate.push(value);
      }
    }
  );
  return bosonAccountHandlerIface.encodeFunctionData("optInToSellerUpdate", [
    seller.id,
    fieldsToUpdate
  ]);
}

export function encodeCreateDisputeResolver(args: CreateDisputeResolverArgs) {
  return bosonAccountHandlerIface.encodeFunctionData("createDisputeResolver", [
    createDisputeResolverArgsToDisputeResolverStruct(args),
    args.fees,
    args.sellerAllowList || []
  ]);
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

export function encodeOptInToDisputeResolverUpdate(
  disputeResolver: OptInToDisputeResolverUpdateArgs
) {
  const fieldsToUpdate: number[] = [];
  Object.entries(DisputeResolverUpdateFields).forEach(
    ([key, value]: [string, number]) => {
      if (disputeResolver.fieldsToUpdate[key]) {
        fieldsToUpdate.push(value);
      }
    }
  );
  return bosonAccountHandlerIface.encodeFunctionData(
    "optInToDisputeResolverUpdate",
    [disputeResolver.id, fieldsToUpdate]
  );
}

// TODO: add a unit test for collectionId
export function createSellerArgsToStruct(
  args: CreateSellerArgs,
  collectionSalt: string
): {
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
    sellerStruct: argsToSellerStruct(sellerStructArgs),
    authTokenStruct: {
      tokenId: authTokenId,
      tokenType: authTokenType
    },
    voucherInitValues: {
      contractURI: contractUri,
      royaltyPercentage,
      collectionSalt
    }
  };
}

export function createCollectionArgsToStruct(args: CreateCollectionArgs): {
  externalId: string;
  voucherInitValues: VoucherInitValuesStruct;
} {
  const { collectionId, contractUri } = args;
  const collectionSalt =
    args.collectionSalt ||
    formatBytes32String(collectionId || INITIAL_COLLECTION_ID);
  return {
    externalId: collectionId,
    voucherInitValues: {
      contractURI: contractUri,
      royaltyPercentage: "0", // useless after protocol v2.4.0
      collectionSalt
    }
  };
}

export function updateSellerArgsToStruct(args: UpdateSellerArgs) {
  const { authTokenId, authTokenType, ...sellerStructArgs } = args;
  return {
    sellerStruct: argsToSellerStruct(sellerStructArgs),
    authTokenStruct: {
      tokenId: authTokenId,
      tokenType: authTokenType
    }
  };
}

function argsToSellerStruct(args: {
  assistant: string;
  admin: string;
  treasury: string;
  metadataUri: string;
}): Partial<SellerStruct> {
  return {
    // NOTE: It doesn't matter which values we set for `id` and `active` here
    // as they will be overridden by the contract. But to conform to the struct
    // we need to set some arbitrary values.
    id: "0",
    active: true,
    clerk: AddressZero,
    ...args
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
    clerk: AddressZero,
    ...args,
    escalationResponsePeriod: utils.timestamp.msToSec(
      args.escalationResponsePeriodInMS
    )
  };
}

export function encodeIsSellerSaltAvailable(
  adminAddress: string,
  salt: string
) {
  return bosonAccountHandlerIface.encodeFunctionData("isSellerSaltAvailable", [
    adminAddress,
    salt
  ]);
}

export function decodeIsSellerSaltAvailable(result: string): boolean {
  const [isAvailable] = bosonAccountHandlerIface.decodeFunctionResult(
    "isSellerSaltAvailable",
    result
  );
  return isAvailable;
}

export function encodeCalculateCollectionAddress(
  sellerId: BigNumberish,
  collectionSalt: string
) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "calculateCollectionAddress",
    [sellerId, collectionSalt]
  );
}

export function decodeCalculateCollectionAddress(result: string): {
  collectionAddress: string;
  isAvailable: boolean;
} {
  const [collectionAddress, isAvailable] =
    bosonAccountHandlerIface.decodeFunctionResult(
      "calculateCollectionAddress",
      result
    );
  return { collectionAddress, isAvailable };
}

export function encodeAddRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipients: RoyaltyRecipientInfo[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData("addRoyaltyRecipients", [
    args.sellerId,
    args.royaltyRecipients
  ]);
}

export function encodeUpdateRoyaltyRecipients(args: {
  sellerId: BigNumberish;
  royaltyRecipientIds: BigNumberish[];
  royaltyRecipients: RoyaltyRecipientInfo[];
}) {
  return bosonAccountHandlerIface.encodeFunctionData(
    "updateRoyaltyRecipients",
    [args.sellerId, args.royaltyRecipientIds, args.royaltyRecipients]
  );
}

export function encodeGetRoyaltyRecipients(args: { sellerId: BigNumberish }) {
  return bosonAccountHandlerIface.encodeFunctionData("getRoyaltyRecipients", [
    args.sellerId
  ]);
}

export function decodeGetRoyaltyRecipients(
  result: string
): RoyaltyRecipientInfo[] {
  const [royaltyRecipients] = bosonAccountHandlerIface.decodeFunctionResult(
    "getRoyaltyRecipients",
    result
  );
  // Temporary patch (until the protocol ABI for getRoyaltyRecipients() is fixed)
  const trim = (s: string) => {
    const s1 = s.replace("0x", "");
    return `0x${s1.length <= 40 ? "0".repeat(40 - s1.length) : ""}${s1}`;
  };
  return royaltyRecipients.map((rr) => {
    return {
      wallet: trim(BigNumber.from(rr.id).toHexString()),
      minRoyaltyPercentage: BigNumber.from(rr.wallet).toString()
    };
  });
}
