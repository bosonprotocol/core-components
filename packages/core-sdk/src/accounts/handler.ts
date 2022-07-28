import {
  Web3LibAdapter,
  TransactionResponse,
  utils
} from "@bosonprotocol/common";
import { BigNumberish } from "@ethersproject/bignumber";
import { DisputeResolverFieldsFragment } from "../subgraph";
import {
  encodeCreateAccount,
  encodeCreateDisputeResolver,
  encodeActivateDisputeResolver,
  encodeAddFeesToDisputeResolver,
  encodeAddSellersToAllowList,
  encodeRemoveFeesFromDisputeResolver,
  encodeRemoveSellersFromAllowList,
  encodeUpdateDisputeResolver
} from "./interface";
import { getDisputeResolverById } from "./subgraph";
import {
  CreateSellerArgs,
  CreateDisputeResolverArgs,
  DisputeResolutionFee,
  DisputeResolverUpdates
} from "./types";

export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateAccount(args.sellerToCreate)
  });
}

export async function createDisputeResolver(args: {
  disputeResolverToCreate: CreateDisputeResolverArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  // TODO: validate metadata
  // disputeResolverToCreate.metadataUri

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateDisputeResolver(args.disputeResolverToCreate)
  });
}

export async function activateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeActivateDisputeResolver(args.disputeResolverId)
  });
}

export async function addFeesToDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  fees: DisputeResolutionFee[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeAddFeesToDisputeResolver(args)
  });
}

export async function addSellersToAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeAddSellersToAllowList(args)
  });
}

export async function removeFeesFromDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  feeTokenAddresses: string[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRemoveFeesFromDisputeResolver(args)
  });
}

export async function removeSellersFromAllowList(args: {
  disputeResolverId: BigNumberish;
  sellerAllowList: BigNumberish[];
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeRemoveSellersFromAllowList(args)
  });
}

export async function updateDisputeResolver(args: {
  disputeResolverId: BigNumberish;
  updates: DisputeResolverUpdates;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
  subgraphUrl: string;
}) {
  const disputeResolver = await getDisputeResolverById(
    args.subgraphUrl,
    args.disputeResolverId
  );

  assertDisputeResolver(args.disputeResolverId, disputeResolver);

  // TODO: validate metadata
  // updates.metadataUri

  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeUpdateDisputeResolver({
      ...disputeResolver,
      ...args.updates,
      escalationResponsePeriod: args.updates.escalationResponsePeriodInMS
        ? utils.timestamp.msToSec(args.updates.escalationResponsePeriodInMS)
        : disputeResolver.escalationResponsePeriod
    })
  });
}

function assertDisputeResolver(
  disputeResolverId: BigNumberish,
  disputeResolver?: DisputeResolverFieldsFragment
) {
  if (!disputeResolver) {
    throw new Error(
      `Dispute resolver with id ${disputeResolverId} does not exist`
    );
  }
}
