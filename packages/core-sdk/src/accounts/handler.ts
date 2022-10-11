import {
  Web3LibAdapter,
  TransactionResponse,
  utils,
  AuthTokenType
} from "@bosonprotocol/common";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import {
  DisputeResolverFieldsFragment,
  GetSellersQueryQueryVariables,
  SellerFieldsFragment
} from "../subgraph";
import {
  encodeCreateSeller,
  encodeUpdateSeller,
  encodeCreateDisputeResolver,
  encodeActivateDisputeResolver,
  encodeAddFeesToDisputeResolver,
  encodeAddSellersToAllowList,
  encodeRemoveFeesFromDisputeResolver,
  encodeRemoveSellersFromAllowList,
  encodeUpdateDisputeResolver
} from "./interface";
import { getDisputeResolverById, getSellerByAddress } from "./subgraph";
import * as erc721Handler from "../erc721/handler";
import {
  CreateSellerArgs,
  UpdateSellerArgs,
  CreateDisputeResolverArgs,
  DisputeResolutionFee,
  DisputeResolverUpdates
} from "./types";

export async function getSellersByAddressOrAuthToken(args: {
  lensHubContractAddress?: string;
  accountAddress: string;
  web3Lib: Web3LibAdapter;
  queryVars?: GetSellersQueryQueryVariables;
  subgraphUrl: string;
}): Promise<SellerFieldsFragment[]> {
  if (args.accountAddress === AddressZero) {
    throw new Error(`Unsupported search address '${AddressZero}'`);
  }
  const seller = await getSellerByAddress(
    args.subgraphUrl,
    args.accountAddress,
    args.queryVars
  );
  if (!seller && args.lensHubContractAddress) {
    // If seller is not found per address, try to find per authToken
    const tokenType = AuthTokenType.LENS; // only LENS for now
    const tokenIds = await fetchAuthTokensOfAccount(args);
    const promises: Promise<SellerFieldsFragment>[] = [];
    for (const tokenId of tokenIds) {
      // Just in case the user owns several auth tokens
      const sellerPromise = this.getSellerByAuthToken(
        tokenId,
        tokenType,
        args.queryVars
      );
      promises.push(sellerPromise);
    }
    return (await Promise.all(promises)).filter((seller) => !!seller);
  }
  return [seller].filter((seller) => !!seller);
}

export async function fetchAuthTokensOfAccount(args: {
  lensHubContractAddress?: string;
  accountAddress: string;
  tokenType: number;
  web3Lib: Web3LibAdapter;
}): Promise<Array<string>> {
  if (args.tokenType !== AuthTokenType.LENS) {
    // only LENS for now
    throw new Error(`Unsupported authTokenType '${args.tokenType}'`);
  }

  if (!args.lensHubContractAddress) {
    throw new Error("LENS contract is not configured in Core-SDK");
  }

  const balance = await erc721Handler.balanceOf({
    contractAddress: args.lensHubContractAddress,
    owner: args.accountAddress,
    web3Lib: args.web3Lib
  });

  const balanceBN = BigNumber.from(balance);
  const tokenIdPromises: Promise<string>[] = [];
  for (let index = 0; balanceBN.gt(index); index++) {
    const tokenIdPromise = erc721Handler.tokenOfOwnerByIndex({
      contractAddress: args.lensHubContractAddress,
      owner: args.accountAddress,
      index,
      web3Lib: args.web3Lib
    });
    tokenIdPromises.push(tokenIdPromise);
  }
  return Promise.all(tokenIdPromises);
}

export async function createSeller(args: {
  sellerToCreate: CreateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeCreateSeller(args.sellerToCreate)
  });
}

export async function updateSeller(args: {
  sellerUpdates: UpdateSellerArgs;
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}): Promise<TransactionResponse> {
  return args.web3Lib.sendTransaction({
    to: args.contractAddress,
    data: encodeUpdateSeller(args.sellerUpdates)
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
