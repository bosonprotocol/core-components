/* eslint-disable @typescript-eslint/ban-types */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { OfferCreator } from "@bosonprotocol/common/src/types/enums";
import {
  OfferCreated,
  OfferVoided,
  OfferExtended,
  RangeReserved,
  OfferRoyaltyInfoUpdated
} from "../../generated/BosonOfferHandler/IBosonOfferHandler";
import {
  OfferCreated as OfferCreated240,
  OfferVoided as OfferVoided240
} from "../../generated/BosonOfferHandler240/IBosonOfferHandler240";
import { OfferCreated as OfferCreated230 } from "../../generated/BosonOfferHandler230/IBosonOfferHandler230";
import { OfferCreated as OfferCreatedLegacy } from "../../generated/BosonOfferHandlerLegacy/IBosonOfferHandlerLegacy";

import {
  Offer,
  RangeEntity,
  RoyaltyInfo,
  RoyaltyRecipientXOffer
} from "../../generated/schema";

import { saveMetadata } from "../entities/metadata/handler";
import { saveExchangeToken } from "../entities/token";
import {
  getDisputeResolutionTermsId,
  saveDisputeResolutionTerms,
  saveDisputeResolutionTerms230,
  saveDisputeResolutionTerms240,
  saveDisputeResolutionTermsLegacy
} from "../entities/dispute-resolution";
import { saveOfferEventLog } from "../entities/event-log";
import {
  checkSellerExist,
  getOfferCollectionId,
  saveRoyaltyRecipient
} from "./account-handler";

export function handleOfferCreatedEvent(event: OfferCreated): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (!offer) {
    const offerStruct = event.params.offer;
    const offerDatesStruct = event.params.offerDates;
    const offerDurationsStruct = event.params.offerDurations;
    const offerFeesStruct = event.params.offerFees;
    const disputeResolutionTermsStruct = event.params.disputeResolutionTerms;

    if (!checkSellerExist(offerStruct.sellerId)) {
      log.warning(
        "Offer '{}' won't be created because seller '{}' does not exist",
        [offerId.toString(), offerStruct.sellerId.toString()]
      );
      return;
    }

    offer = new Offer(offerId.toString());
    offer.createdAt = event.block.timestamp;
    offer.price = offerStruct.price;
    offer.sellerDeposit = offerStruct.sellerDeposit;
    offer.protocolFee = offerFeesStruct.protocolFee;
    offer.agentFee = offerFeesStruct.agentFee;
    offer.agentId = event.params.agentId;
    offer.buyerCancelPenalty = offerStruct.buyerCancelPenalty;
    offer.quantityInitial = offerStruct.quantityAvailable;
    offer.quantityAvailable = offerStruct.quantityAvailable;
    offer.validFromDate = offerDatesStruct.validFrom;
    offer.validUntilDate = offerDatesStruct.validUntil;
    offer.voucherRedeemableFromDate = offerDatesStruct.voucherRedeemableFrom;
    offer.voucherRedeemableUntilDate = offerDatesStruct.voucherRedeemableUntil;
    offer.disputePeriodDuration = offerDurationsStruct.disputePeriod;
    offer.voucherValidDuration = offerDurationsStruct.voucherValid;
    offer.resolutionPeriodDuration = offerDurationsStruct.resolutionPeriod;
    offer.disputeResolverId = disputeResolutionTermsStruct.disputeResolverId;
    offer.sellerId = offerStruct.sellerId;
    offer.creator = offerStruct.creator;
    offer.buyerId = offerStruct.buyerId;
    offer.disputeResolver =
      disputeResolutionTermsStruct.disputeResolverId.toString();
    offer.disputeResolutionTerms = getDisputeResolutionTermsId(
      disputeResolutionTermsStruct.disputeResolverId.toString(),
      offerId.toString()
    );
    if (offerStruct.creator == OfferCreator.Buyer) {
      offer.seller = null;
      offer.buyer = offerStruct.buyerId.toString();
    } else {
      offer.seller = offerStruct.sellerId.toString();
      offer.buyer = null;
    }
    offer.exchangeToken = offerStruct.exchangeToken.toHexString();
    offer.metadataUri = offerStruct.metadataUri;
    offer.metadataHash = offerStruct.metadataHash;
    offer.priceType = offerStruct.priceType;
    const royaltyInfos = offerStruct.royaltyInfo;
    for (let i = 0; i < royaltyInfos.length; i++) {
      saveRoyaltyInfo(
        offerId.toString(),
        royaltyInfos[i].recipients,
        royaltyInfos[i].bps,
        i8(i),
        event.block.timestamp
      );
    }
    offer.metadata = offerId.toString() + "-metadata";
    offer.voided = false;
    offer.collectionIndex = offerStruct.collectionIndex;
    offer.collection = getOfferCollectionId(
      offerStruct.sellerId.toString(),
      offerStruct.collectionIndex.toString()
    );
    offer.numberOfCommits = BigInt.fromI32(0);
    offer.numberOfRedemptions = BigInt.fromI32(0);

    offer.save();

    saveExchangeToken(offerStruct.exchangeToken);
    saveMetadata(offer, event.block.timestamp);
    saveDisputeResolutionTerms(
      disputeResolutionTermsStruct,
      offerId.toString()
    );
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_CREATED",
      event.block.timestamp,
      event.params.executedBy,
      offerStruct.sellerId.toString(),
      offerId.toString()
    );
  }
}

function saveRoyaltyInfo(
  offerId: string,
  recipients: Address[],
  bps: BigInt[],
  index: i8,
  timestamp: BigInt
): void {
  const royaltyInfoId = getRoyaltyInfoId(offerId, index);
  let royaltyInfoEntity = RoyaltyInfo.load(royaltyInfoId);
  if (!royaltyInfoEntity) {
    royaltyInfoEntity = new RoyaltyInfo(royaltyInfoId);
    royaltyInfoEntity.timestamp = timestamp;
    royaltyInfoEntity.offer = offerId;
  }
  const royaltyRecipientXOffers: string[] = [];
  for (let i = 0; i < recipients.length; i++) {
    const wallet = recipients[i];
    let bp = BigInt.zero();
    if (i < bps.length) {
      bp = bps[i];
    }
    royaltyRecipientXOffers.push(
      saveRoyaltyRecipientXOffer(offerId, wallet, bp)
    );
  }
  royaltyInfoEntity.recipients = royaltyRecipientXOffers;
  royaltyInfoEntity.save();
}

function getRoyaltyInfoId(offerId: string, index: i8): string {
  return `${offerId}-royaltyInfo-${index.toString()}`;
}

function getRoyaltyRecipientXOfferId(offerId: string, wallet: Address): string {
  return `${offerId}-royalty-${wallet.toHexString()}`;
}

function saveRoyaltyRecipientXOffer(
  offerId: string,
  wallet: Address,
  bps: BigInt
): string {
  const royaltyRecipientXOfferId = getRoyaltyRecipientXOfferId(offerId, wallet);
  let royaltyRecipientXOffer = RoyaltyRecipientXOffer.load(
    royaltyRecipientXOfferId
  );
  if (!royaltyRecipientXOffer) {
    royaltyRecipientXOffer = new RoyaltyRecipientXOffer(
      royaltyRecipientXOfferId
    );
    royaltyRecipientXOffer.recipient = saveRoyaltyRecipient(wallet);
  }
  royaltyRecipientXOffer.offer = offerId;
  royaltyRecipientXOffer.bps = bps;
  royaltyRecipientXOffer.save();
  return royaltyRecipientXOfferId;
}

export function handleOfferCreatedEvent240(event: OfferCreated240): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (!offer) {
    const offerStruct = event.params.offer;
    const offerDatesStruct = event.params.offerDates;
    const offerDurationsStruct = event.params.offerDurations;
    const offerFeesStruct = event.params.offerFees;
    const disputeResolutionTermsStruct = event.params.disputeResolutionTerms;

    if (!checkSellerExist(offerStruct.sellerId)) {
      log.warning(
        "Offer '{}' won't be created because seller '{}' does not exist",
        [offerId.toString(), offerStruct.sellerId.toString()]
      );
      return;
    }

    offer = new Offer(offerId.toString());
    offer.createdAt = event.block.timestamp;
    offer.price = offerStruct.price;
    offer.sellerDeposit = offerStruct.sellerDeposit;
    offer.protocolFee = offerFeesStruct.protocolFee;
    offer.agentFee = offerFeesStruct.agentFee;
    offer.agentId = event.params.agentId;
    offer.buyerCancelPenalty = offerStruct.buyerCancelPenalty;
    offer.quantityInitial = offerStruct.quantityAvailable;
    offer.quantityAvailable = offerStruct.quantityAvailable;
    offer.validFromDate = offerDatesStruct.validFrom;
    offer.validUntilDate = offerDatesStruct.validUntil;
    offer.voucherRedeemableFromDate = offerDatesStruct.voucherRedeemableFrom;
    offer.voucherRedeemableUntilDate = offerDatesStruct.voucherRedeemableUntil;
    offer.disputePeriodDuration = offerDurationsStruct.disputePeriod;
    offer.voucherValidDuration = offerDurationsStruct.voucherValid;
    offer.resolutionPeriodDuration = offerDurationsStruct.resolutionPeriod;
    offer.disputeResolverId = disputeResolutionTermsStruct.disputeResolverId;
    offer.sellerId = offerStruct.sellerId;
    offer.creator = i8(OfferCreator.Seller);
    offer.buyerId = BigInt.fromI32(0);
    offer.disputeResolver =
      disputeResolutionTermsStruct.disputeResolverId.toString();
    offer.disputeResolutionTerms = getDisputeResolutionTermsId(
      disputeResolutionTermsStruct.disputeResolverId.toString(),
      offerId.toString()
    );
    offer.seller = offerStruct.sellerId.toString();
    offer.exchangeToken = offerStruct.exchangeToken.toHexString();
    offer.metadataUri = offerStruct.metadataUri;
    offer.metadataHash = offerStruct.metadataHash;
    offer.priceType = offerStruct.priceType;
    const royaltyInfos = offerStruct.royaltyInfo;
    for (let i = 0; i < royaltyInfos.length; i++) {
      saveRoyaltyInfo(
        offerId.toString(),
        royaltyInfos[i].recipients,
        royaltyInfos[i].bps,
        i8(i),
        event.block.timestamp
      );
    }
    offer.metadata = offerId.toString() + "-metadata";
    offer.voided = false;
    offer.collectionIndex = offerStruct.collectionIndex;
    offer.collection = getOfferCollectionId(
      offerStruct.sellerId.toString(),
      offerStruct.collectionIndex.toString()
    );
    offer.numberOfCommits = BigInt.fromI32(0);
    offer.numberOfRedemptions = BigInt.fromI32(0);

    offer.save();

    saveExchangeToken(offerStruct.exchangeToken);
    saveMetadata(offer, event.block.timestamp);
    saveDisputeResolutionTerms240(
      disputeResolutionTermsStruct,
      offerId.toString()
    );
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_CREATED",
      event.block.timestamp,
      event.params.executedBy,
      offerStruct.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferCreatedEvent230(event: OfferCreated230): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (!offer) {
    const offerStruct = event.params.offer;
    const offerDatesStruct = event.params.offerDates;
    const offerDurationsStruct = event.params.offerDurations;
    const offerFeesStruct = event.params.offerFees;
    const disputeResolutionTermsStruct = event.params.disputeResolutionTerms;

    if (!checkSellerExist(offerStruct.sellerId)) {
      log.warning(
        "Offer '{}' won't be created because seller '{}' does not exist",
        [offerId.toString(), offerStruct.sellerId.toString()]
      );
      return;
    }

    offer = new Offer(offerId.toString());
    offer.createdAt = event.block.timestamp;
    offer.price = offerStruct.price;
    offer.sellerDeposit = offerStruct.sellerDeposit;
    offer.protocolFee = offerFeesStruct.protocolFee;
    offer.agentFee = offerFeesStruct.agentFee;
    offer.agentId = event.params.agentId;
    offer.buyerCancelPenalty = offerStruct.buyerCancelPenalty;
    offer.quantityInitial = offerStruct.quantityAvailable;
    offer.quantityAvailable = offerStruct.quantityAvailable;
    offer.validFromDate = offerDatesStruct.validFrom;
    offer.validUntilDate = offerDatesStruct.validUntil;
    offer.voucherRedeemableFromDate = offerDatesStruct.voucherRedeemableFrom;
    offer.voucherRedeemableUntilDate = offerDatesStruct.voucherRedeemableUntil;
    offer.disputePeriodDuration = offerDurationsStruct.disputePeriod;
    offer.voucherValidDuration = offerDurationsStruct.voucherValid;
    offer.resolutionPeriodDuration = offerDurationsStruct.resolutionPeriod;
    offer.disputeResolverId = disputeResolutionTermsStruct.disputeResolverId;
    offer.sellerId = offerStruct.sellerId;
    offer.disputeResolver =
      disputeResolutionTermsStruct.disputeResolverId.toString();
    offer.disputeResolutionTerms = getDisputeResolutionTermsId(
      disputeResolutionTermsStruct.disputeResolverId.toString(),
      offerId.toString()
    );
    offer.seller = offerStruct.sellerId.toString();
    offer.exchangeToken = offerStruct.exchangeToken.toHexString();
    offer.metadataUri = offerStruct.metadataUri;
    offer.metadataHash = offerStruct.metadataHash;
    offer.metadata = offerId.toString() + "-metadata";
    offer.voided = false;
    offer.collectionIndex = offerStruct.collectionIndex;
    offer.collection = getOfferCollectionId(
      offerStruct.sellerId.toString(),
      offerStruct.collectionIndex.toString()
    );
    offer.numberOfCommits = BigInt.fromI32(0);
    offer.numberOfRedemptions = BigInt.fromI32(0);
    offer.priceType = i8(0); // default value for legacy offers
    // TODO: set default royalty recipients for legacy offers?
    offer.creator = i8(OfferCreator.Seller);
    offer.buyerId = BigInt.fromI32(0);

    offer.save();

    saveExchangeToken(offerStruct.exchangeToken);
    saveMetadata(offer, event.block.timestamp);
    saveDisputeResolutionTerms230(
      disputeResolutionTermsStruct,
      offerId.toString()
    );
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_CREATED",
      event.block.timestamp,
      event.params.executedBy,
      offerStruct.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferCreatedEventLegacy(event: OfferCreatedLegacy): void {
  const offerId = event.params.offerId;

  let offer = Offer.load(offerId.toString());

  if (!offer) {
    const offerStruct = event.params.offer;
    const offerDatesStruct = event.params.offerDates;
    const offerDurationsStruct = event.params.offerDurations;
    const offerFeesStruct = event.params.offerFees;
    const disputeResolutionTermsStruct = event.params.disputeResolutionTerms;
    const collectionIndex = BigInt.fromI32(0); // collectionIndex does not exist in OfferCreatedLegacy event (< v2.3.0)

    if (!checkSellerExist(offerStruct.sellerId)) {
      log.warning(
        "Offer '{}' won't be created because seller '{}' does not exist",
        [offerId.toString(), offerStruct.sellerId.toString()]
      );
      return;
    }

    offer = new Offer(offerId.toString());
    offer.createdAt = event.block.timestamp;
    offer.price = offerStruct.price;
    offer.sellerDeposit = offerStruct.sellerDeposit;
    offer.protocolFee = offerFeesStruct.protocolFee;
    offer.agentFee = offerFeesStruct.agentFee;
    offer.agentId = event.params.agentId;
    offer.buyerCancelPenalty = offerStruct.buyerCancelPenalty;
    offer.quantityInitial = offerStruct.quantityAvailable;
    offer.quantityAvailable = offerStruct.quantityAvailable;
    offer.validFromDate = offerDatesStruct.validFrom;
    offer.validUntilDate = offerDatesStruct.validUntil;
    offer.voucherRedeemableFromDate = offerDatesStruct.voucherRedeemableFrom;
    offer.voucherRedeemableUntilDate = offerDatesStruct.voucherRedeemableUntil;
    offer.disputePeriodDuration = offerDurationsStruct.disputePeriod;
    offer.voucherValidDuration = offerDurationsStruct.voucherValid;
    offer.resolutionPeriodDuration = offerDurationsStruct.resolutionPeriod;
    offer.disputeResolverId = disputeResolutionTermsStruct.disputeResolverId;
    offer.sellerId = offerStruct.sellerId;
    offer.disputeResolver =
      disputeResolutionTermsStruct.disputeResolverId.toString();
    offer.disputeResolutionTerms = getDisputeResolutionTermsId(
      disputeResolutionTermsStruct.disputeResolverId.toString(),
      offerId.toString()
    );
    offer.seller = offerStruct.sellerId.toString();
    offer.exchangeToken = offerStruct.exchangeToken.toHexString();
    offer.metadataUri = offerStruct.metadataUri;
    offer.metadataHash = offerStruct.metadataHash;
    offer.metadata = offerId.toString() + "-metadata";
    offer.voided = false;
    offer.collectionIndex = collectionIndex;
    offer.collection = getOfferCollectionId(
      offerStruct.sellerId.toString(),
      collectionIndex.toString()
    );

    offer.numberOfCommits = BigInt.fromI32(0);
    offer.numberOfRedemptions = BigInt.fromI32(0);
    offer.priceType = i8(0); // default value for legacy offers
    // TODO: set default royalty recipients for legacy offers?
    offer.creator = i8(OfferCreator.Seller);
    offer.buyerId = BigInt.fromI32(0);

    offer.save();

    saveExchangeToken(offerStruct.exchangeToken);
    saveMetadata(offer, event.block.timestamp);
    saveDisputeResolutionTermsLegacy(
      disputeResolutionTermsStruct,
      offerId.toString()
    );
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_CREATED",
      event.block.timestamp,
      event.params.executedBy,
      offerStruct.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferVoidedEvent(event: OfferVoided): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer) {
    offer.voided = true;
    offer.voidedAt = event.block.timestamp;

    offer.save();

    saveMetadata(offer, offer.createdAt);
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_VOIDED",
      event.block.timestamp,
      event.params.executedBy,
      event.params.creatorId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferVoidedEvent240(event: OfferVoided240): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer) {
    offer.voided = true;
    offer.voidedAt = event.block.timestamp;

    offer.save();

    saveMetadata(offer, offer.createdAt);
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_VOIDED",
      event.block.timestamp,
      event.params.executedBy,
      event.params.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferExtendedEvent(event: OfferExtended): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer) {
    offer.validUntilDate = event.params.validUntilDate;
    offer.save();
    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_EXTENDED",
      event.block.timestamp,
      event.params.executedBy,
      offer.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function getRangeId(offerId: string): string {
  const rangeId = offerId.toString() + "-range";
  return rangeId;
}

export function handleRangeReservedEvent(event: RangeReserved): void {
  const offerId = event.params.offerId;

  const offer = Offer.load(offerId.toString());

  if (offer) {
    const rangeId = getRangeId(offerId.toString());
    let rangeEntity = RangeEntity.load(rangeId);

    if (!rangeEntity) {
      rangeEntity = new RangeEntity(rangeId);
      rangeEntity.minted = BigInt.zero();
    }
    rangeEntity.start = event.params.startExchangeId;
    rangeEntity.end = event.params.endExchangeId;
    rangeEntity.owner = event.params.owner;
    rangeEntity.save();

    const rangeLength = rangeEntity.end
      .minus(rangeEntity.start)
      .plus(BigInt.fromI32(1));
    offer.quantityAvailable = offer.quantityAvailable.minus(rangeLength);
    offer.range = rangeId;

    offer.save();

    saveOfferEventLog(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "OFFER_RANGE_RESERVED",
      event.block.timestamp,
      event.params.executedBy,
      offer.sellerId.toString(),
      offerId.toString()
    );
  }
}

export function handleOfferRoyaltyInfoUpdatedEvent(
  event: OfferRoyaltyInfoUpdated
): void {
  const offerId = event.params.offerId;
  const royaltyInfo = event.params.royaltyInfo;
  const offer = Offer.load(offerId.toString());
  const timestamp = event.block.timestamp;

  if (offer) {
    const royaltyInfos = offer.royaltyInfos.load();
    const index = i8(royaltyInfos.length);
    saveRoyaltyInfo(
      offerId.toString(),
      royaltyInfo.recipients,
      royaltyInfo.bps,
      index,
      timestamp
    );
  } else {
    log.warning("Offer with ID '{}' not found", [offerId.toString()]);
  }
}
