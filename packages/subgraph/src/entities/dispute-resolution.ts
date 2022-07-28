import { Address, BigInt } from "@graphprotocol/graph-ts";
import { OfferCreatedDisputeResolutionTermsStruct } from "../../generated/BosonOfferHandler/IBosonOfferHandler";
import { IBosonAccountHandler } from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import {
  DisputeResolutionTermsEntity,
  DisputeResolverFee,
  DisputeResolver
} from "../../generated/schema";
import { saveExchangeToken } from "./token";

export function getDisputeResolutionTermsId(
  disputeResolverId: string,
  offerId: string
): string {
  return `${disputeResolverId}-${offerId}-terms`;
}

export function saveDisputeResolutionTerms(
  disputeResolutionTerms: OfferCreatedDisputeResolutionTermsStruct,
  offerId: string
): string | null {
  const disputeResolutionTermsId = getDisputeResolutionTermsId(
    disputeResolutionTerms.disputeResolverId.toString(),
    offerId
  );

  let terms = DisputeResolutionTermsEntity.load(disputeResolutionTermsId);

  if (!terms) {
    terms = new DisputeResolutionTermsEntity(disputeResolutionTermsId);
  }

  terms.escalationResponsePeriod =
    disputeResolutionTerms.escalationResponsePeriod;
  terms.buyerEscalationDeposit = disputeResolutionTerms.buyerEscalationDeposit;
  terms.disputeResolverId = disputeResolutionTerms.disputeResolverId;
  terms.disputeResolver = disputeResolutionTerms.disputeResolverId.toString();
  terms.feeAmount = disputeResolutionTerms.feeAmount;
  terms.save();

  return disputeResolutionTermsId;
}

export function getAndSaveDisputeResolver(
  disputeResolverId: BigInt,
  accountHandlerAddress: Address
): void {
  const accountHandlerContract = IBosonAccountHandler.bind(
    accountHandlerAddress
  );

  const getDisputeResolverResult =
    accountHandlerContract.getDisputeResolver(disputeResolverId);
  const disputeResolverFromContract = getDisputeResolverResult.value1;
  const sellerAllowList = getDisputeResolverResult.value3;

  let disputeResolver = DisputeResolver.load(disputeResolverId.toString());

  if (!disputeResolver) {
    disputeResolver = new DisputeResolver(disputeResolverId.toString());
  }

  disputeResolver.escalationResponsePeriod =
    disputeResolverFromContract.escalationResponsePeriod;
  disputeResolver.operator = disputeResolverFromContract.operator;
  disputeResolver.admin = disputeResolverFromContract.admin;
  disputeResolver.clerk = disputeResolverFromContract.clerk;
  disputeResolver.treasury = disputeResolverFromContract.treasury;
  disputeResolver.metadataUri = disputeResolverFromContract.metadataUri;
  disputeResolver.active = disputeResolverFromContract.active;
  disputeResolver.sellerAllowList = sellerAllowList;
  disputeResolver.save();
}

export function getDisputeResolverFeesId(
  disputeResolverId: string,
  tokenAddress: string
): string {
  return `${disputeResolverId}-${tokenAddress}-fee`;
}

export function getAndSaveDisputeResolverFees(
  disputeResolverId: BigInt,
  accountHandlerAddress: Address
): void {
  const accountHandlerContract = IBosonAccountHandler.bind(
    accountHandlerAddress
  );

  const getDisputeResolverResult =
    accountHandlerContract.getDisputeResolver(disputeResolverId);

  const fees = getDisputeResolverResult.value2;

  const savedFeeIds: string[] = [];

  for (let i = 0; i < fees.length; i++) {
    const feeFromContract = fees[i];

    const feeId = getDisputeResolverFeesId(
      disputeResolverId.toString(),
      feeFromContract.tokenAddress.toHexString()
    );

    let disputeResolverFee = DisputeResolverFee.load(feeId);

    if (!disputeResolverFee) {
      disputeResolverFee = new DisputeResolverFee(feeId);
    }

    disputeResolverFee.tokenAddress = feeFromContract.tokenAddress;
    disputeResolverFee.tokenName = feeFromContract.tokenName;
    disputeResolverFee.token = feeFromContract.tokenAddress.toHexString();
    disputeResolverFee.feeAmount = feeFromContract.feeAmount;
    disputeResolverFee.save();
    savedFeeIds.push(feeId);

    saveExchangeToken(feeFromContract.tokenAddress);
  }

  const disputeResolver = DisputeResolver.load(disputeResolverId.toString());

  if (disputeResolver) {
    disputeResolver.fees = savedFeeIds;
    disputeResolver.save();
  }
}
