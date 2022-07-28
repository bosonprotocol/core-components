import { OfferCreatedDisputeResolutionTermsStruct } from "../../generated/BosonOfferHandler/IBosonOfferHandler";
import { DisputeResolutionTermsEntity } from "../../generated/schema";

export function getDisputeResolutionTermsId(
  disputeResolverId: string,
  offerId: string
): string {
  return `${disputeResolverId}-${offerId}`;
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

  terms.buyerEscalationDeposit = disputeResolutionTerms.buyerEscalationDeposit;
  terms.disputeResolverId = disputeResolutionTerms.disputeResolverId;
  terms.disputeResolver = disputeResolutionTerms.disputeResolverId.toString();
  terms.feeAmount = disputeResolutionTerms.feeAmount;
  terms.save();

  return disputeResolutionTermsId;
}
