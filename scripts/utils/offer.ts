import { ITokenInfo } from "./../../packages/core-sdk/src/utils/tokenInfoManager";
import {
  SEC_PER_DAY,
  SEC_PER_HOUR,
  SEC_PER_MIN
} from "./../../packages/common/src/utils/timestamp";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "../../node_modules/ethers/lib/utils";

type Offer = {
  id: string;
  sellerId: string;
  price: string;
  sellerDeposit: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  exchangeToken: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
};

type ExtendedOffer = Offer & {
  priceDecimals: string;
  sellerDepositDecimals: string;
  buyerCancelPenaltyDecimals: string;
  exchangeTokenInfo: ITokenInfo;
};

function extendDecimals(
  intValue: string,
  decimals: number,
  symbol: string
): string {
  return `${formatUnits(intValue, decimals)} ${symbol}`;
}

function extendOffer(
  offerStruct: Offer,
  exchangeTokenInfo: ITokenInfo
): ExtendedOffer {
  return {
    ...offerStruct,
    exchangeTokenInfo,
    priceDecimals: extendDecimals(
      offerStruct.price,
      exchangeTokenInfo.decimals,
      exchangeTokenInfo.symbol
    ),
    sellerDepositDecimals: extendDecimals(
      offerStruct.sellerDeposit,
      exchangeTokenInfo.decimals,
      exchangeTokenInfo.symbol
    ),
    buyerCancelPenaltyDecimals: extendDecimals(
      offerStruct.buyerCancelPenalty,
      exchangeTokenInfo.decimals,
      exchangeTokenInfo.symbol
    )
  };
}

function offerFromStruct(struct: Array<any>): Offer {
  const [
    id,
    sellerId,
    price,
    sellerDeposit,
    buyerCancelPenalty,
    quantityAvailable,
    exchangeToken,
    metadataUri,
    metadataHash,
    voided
  ] = struct;
  return {
    id: id.toString(),
    sellerId: sellerId.toString(),
    price: price.toString(),
    sellerDeposit: sellerDeposit.toString(),
    buyerCancelPenalty: buyerCancelPenalty.toString(),
    quantityAvailable: quantityAvailable.toString(),
    exchangeToken,
    metadataUri,
    metadataHash,
    voided
  };
}

type OfferDates = {
  validFrom: string;
  validUntil: string;
  voucherRedeemableFrom: string;
  voucherRedeemableUntil: string;
};

type ExtendedOfferDates = OfferDates & {
  validFromDate: Date;
  validUntilDate: Date;
  voucherRedeemableFromDate: Date;
  voucherRedeemableUntilDate: Date;
};

function extendOfferDates(offerDatesStruct: OfferDates): ExtendedOfferDates {
  const convertToDate = (str: string) =>
    new Date(BigNumber.from(str).mul(1000).toNumber());
  return {
    ...offerDatesStruct,
    validFromDate: convertToDate(offerDatesStruct.validFrom),
    validUntilDate: convertToDate(offerDatesStruct.validUntil),
    voucherRedeemableFromDate: convertToDate(
      offerDatesStruct.voucherRedeemableFrom
    ),
    voucherRedeemableUntilDate: convertToDate(
      offerDatesStruct.voucherRedeemableUntil
    )
  };
}

function offerDatesFromStruct(struct: Array<any>): OfferDates {
  const [validFrom, validUntil, voucherRedeemableFrom, voucherRedeemableUntil] =
    struct;
  return {
    validFrom: validFrom.toString(),
    validUntil: validUntil.toString(),
    voucherRedeemableFrom: voucherRedeemableFrom.toString(),
    voucherRedeemableUntil: voucherRedeemableUntil.toString()
  };
}

type OfferDurations = {
  disputePeriod: string;
  voucherValid: string;
  resolutionPeriod: string;
};

type ExtendedOfferDurations = OfferDurations & {
  disputePeriodDuration: string;
  voucherValidDuration: string;
  resolutionPeriodDuration: string;
};

function convertDuration(str: string): string {
  const nbSec = parseInt(str);
  const days = Math.floor(nbSec / SEC_PER_DAY);
  const hours = Math.floor((nbSec - days * SEC_PER_DAY) / SEC_PER_HOUR);
  const min = Math.floor(
    (nbSec - days * SEC_PER_DAY - hours * SEC_PER_HOUR) / SEC_PER_MIN
  );
  const sec =
    nbSec - days * SEC_PER_DAY - hours * SEC_PER_HOUR - min * SEC_PER_MIN;
  return `${days} days ${hours}h${min}'${sec}"`;
}

function extendOfferDurations(
  offerDurationsStruct: OfferDurations
): ExtendedOfferDurations {
  return {
    ...offerDurationsStruct,
    disputePeriodDuration: convertDuration(offerDurationsStruct.disputePeriod),
    resolutionPeriodDuration: convertDuration(
      offerDurationsStruct.resolutionPeriod
    ),
    voucherValidDuration: convertDuration(offerDurationsStruct.voucherValid)
  };
}

function offerDurationsFromStruct(struct: Array<any>): OfferDurations {
  const [disputePeriod, voucherValid, resolutionPeriod] = struct;
  return {
    disputePeriod: disputePeriod.toString(),
    voucherValid: voucherValid.toString(),
    resolutionPeriod: resolutionPeriod.toString()
  };
}

type DisputeResolutionTerms = {
  disputeResolverId: string;
  escalationResponsePeriod: string;
  feeAmount: string;
  buyerEscalationDeposit: string;
};

type ExtendedDisputeResolutionTerms = DisputeResolutionTerms & {
  escalationResponsePeriodDuration: string;
  feeAmountDecimals: string;
  buyerEscalationDepositDecimals: string;
};

function extendDisputeResolutionTerms(
  disputeResolutionTermsStruct: DisputeResolutionTerms,
  tokenInfo: ITokenInfo
): ExtendedDisputeResolutionTerms {
  return {
    ...disputeResolutionTermsStruct,
    buyerEscalationDepositDecimals: extendDecimals(
      disputeResolutionTermsStruct.buyerEscalationDeposit,
      tokenInfo.decimals,
      tokenInfo.symbol
    ),
    feeAmountDecimals: extendDecimals(
      disputeResolutionTermsStruct.feeAmount,
      tokenInfo.decimals,
      tokenInfo.symbol
    ),
    escalationResponsePeriodDuration: convertDuration(
      disputeResolutionTermsStruct.escalationResponsePeriod
    )
  };
}

function disputeResolutionTermsFromStruct(
  struct: Array<any>
): DisputeResolutionTerms {
  const [
    disputeResolverId,
    escalationResponsePeriod,
    feeAmount,
    buyerEscalationDeposit
  ] = struct;
  return {
    disputeResolverId: disputeResolverId.toString(),
    escalationResponsePeriod: escalationResponsePeriod.toString(),
    feeAmount: feeAmount.toString(),
    buyerEscalationDeposit: buyerEscalationDeposit.toString()
  };
}

type OfferFees = {
  protocolFee;
  agentFee;
};

type ExtendedOfferFees = OfferFees & {
  protocolFeeDecimals: string;
  agentFeeDecimals: string;
};

function extendOfferFees(
  offerFeesStruct: OfferFees,
  tokenInfo: ITokenInfo
): ExtendedOfferFees {
  return {
    ...offerFeesStruct,
    protocolFeeDecimals: extendDecimals(
      offerFeesStruct.protocolFee,
      tokenInfo.decimals,
      tokenInfo.symbol
    ),
    agentFeeDecimals: extendDecimals(
      offerFeesStruct.agentFee,
      tokenInfo.decimals,
      tokenInfo.symbol
    )
  };
}

function offerFeesFromStruct(struct: Array<any>): OfferFees {
  const [protocolFee, agentFee] = struct;
  return {
    protocolFee: protocolFee.toString(),
    agentFee: agentFee.toString()
  };
}

export type OfferData = {
  exists: boolean;
  offer: Offer;
  offerDates: OfferDates;
  offerDurations: OfferDurations;
  disputeResolutionTerms: DisputeResolutionTerms;
  offerFees: OfferFees;
};

export type ExtendedOfferData = {
  exists: boolean;
  offer: ExtendedOffer;
  offerDates: OfferDates;
  offerDurations: OfferDurations;
  disputeResolutionTerms: DisputeResolutionTerms;
  offerFees: OfferFees;
};

export function extractOfferData(offerData: Array<unknown>): OfferData {
  const [
    exists,
    offerStruct,
    offerDatesStruct,
    offerDurationsStruct,
    disputeResolutionTermsStruct,
    offerFeesStruct
  ] = offerData;
  const offer = offerFromStruct(offerStruct as any[]);
  const offerDates = offerDatesFromStruct(offerDatesStruct as any[]);
  const offerDurations = offerDurationsFromStruct(
    offerDurationsStruct as any[]
  );
  const disputeResolutionTerms = disputeResolutionTermsFromStruct(
    disputeResolutionTermsStruct as any[]
  );
  const offerFees = offerFeesFromStruct(offerFeesStruct as any[]);
  return {
    exists: exists as boolean,
    offer,
    offerDates,
    offerDurations,
    disputeResolutionTerms,
    offerFees
  };
}

export function extractAgentId(agentIdData: Array<unknown>): {
  exists: boolean;
  agentId: string;
} {
  const [exists, agentIdBN] = agentIdData;
  return {
    exists: exists as boolean,
    agentId: (agentIdBN as BigNumber).toString()
  };
}

export function extractOfferDataExtended(
  offerData: Array<unknown>,
  tokenInfo: ITokenInfo
): ExtendedOfferData {
  const offerStruct = extractOfferData(offerData);
  return {
    ...offerStruct,
    offer: extendOffer(offerStruct.offer, tokenInfo),
    offerDates: extendOfferDates(offerStruct.offerDates),
    offerDurations: extendOfferDurations(offerStruct.offerDurations),
    disputeResolutionTerms: extendDisputeResolutionTerms(
      offerStruct.disputeResolutionTerms,
      tokenInfo
    ),
    offerFees: extendOfferFees(offerStruct.offerFees, tokenInfo)
  };
}
