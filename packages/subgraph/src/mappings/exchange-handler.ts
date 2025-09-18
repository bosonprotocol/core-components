import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  BuyerCommitted,
  VoucherCanceled,
  VoucherRevoked,
  VoucherRedeemed,
  VoucherExtended,
  VoucherTransferred,
  ExchangeCompleted,
  VoucherExpired,
  ConditionalCommitAuthorized,
  SellerCommitted,
  BuyerInitiatedOfferSetSellerParams
} from "../../generated/BosonExchangeHandler/IBosonExchangeHandler";
import { BuyerCommitted as BuyerCommitted240 } from "../../generated/BosonExchangeHandler240/IBosonExchangeHandler240";
import { ConditionEntity, Exchange, Offer } from "../../generated/schema";

import { saveMetadata } from "../entities/metadata/handler";
import {
  saveConditionalCommitAuthorizedEventLog,
  saveExchangeEventLogs
} from "../entities/event-log";
import { ZERO_ADDRESS } from "../utils/eth";
import { getOfferCollectionId } from "./account-handler";
import { saveRoyaltyInfo } from "./offer-handler";

export function handleBuyerCommittedEvent(event: BuyerCommitted): void {
  const exchangeFromEvent = event.params.exchange;
  const exchangeId = exchangeFromEvent.id.toString();

  let exchange = Exchange.load(exchangeId);

  if (!exchange) {
    exchange = new Exchange(exchangeId);
  }

  const offer = Offer.load(exchangeFromEvent.offerId.toString());
  if (offer) {
    offer.quantityAvailable = offer.quantityAvailable.minus(BigInt.fromI32(1));
    offer.numberOfCommits = offer.numberOfCommits.plus(BigInt.fromI32(1));
    offer.save();

    saveMetadata(offer, offer.createdAt);

    exchange.seller = offer.seller as string; // We assume seller in defined when BuyerCommitted is emitted
    exchange.disputeResolver = offer.disputeResolver;
  } else {
    log.warning("Unable to find Offer with id '{}'", [
      exchangeFromEvent.offerId.toString()
    ]);
  }

  exchange.buyer = exchangeFromEvent.buyerId.toString();
  exchange.offer = exchangeFromEvent.offerId.toString();
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = event.params.voucher.committedDate;
  exchange.validUntilDate = event.params.voucher.validUntilDate;
  exchange.expired = false;
  exchange.mutualizerAddress = exchangeFromEvent.mutualizerAddress;

  exchange.save();

  saveExchangeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "BUYER_COMMITTED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId
  );
}

export function handleSellerCommittedEvent(event: SellerCommitted): void {
  const exchangeFromEvent = event.params.exchange;
  const exchangeId = exchangeFromEvent.id.toString();

  let exchange = Exchange.load(exchangeId);

  if (!exchange) {
    exchange = new Exchange(exchangeId);
  }

  const offer = Offer.load(exchangeFromEvent.offerId.toString());
  if (offer) {
    offer.quantityAvailable = offer.quantityAvailable.minus(BigInt.fromI32(1));
    offer.numberOfCommits = offer.numberOfCommits.plus(BigInt.fromI32(1));
    offer.save();

    saveMetadata(offer, offer.createdAt);

    exchange.buyer = offer.buyerId.toString();
    exchange.disputeResolver = offer.disputeResolver;
  } else {
    log.warning("Unable to find Offer with id '{}'", [
      exchangeFromEvent.offerId.toString()
    ]);
  }

  exchange.seller = event.params.sellerId.toString();
  exchange.offer = event.params.offerId.toString();
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = event.params.voucher.committedDate;
  exchange.validUntilDate = event.params.voucher.validUntilDate;
  exchange.expired = false;
  exchange.mutualizerAddress = exchangeFromEvent.mutualizerAddress;

  exchange.save();

  saveExchangeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_COMMITTED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId
  );
}

export function handleBuyerInitiatedOfferSetSellerParamsEvent(
  event: BuyerInitiatedOfferSetSellerParams
): void {
  const offerId = event.params.offerId.toString();

  const offer = Offer.load(offerId);

  if (offer) {
    offer.seller = event.params.sellerId.toString();
    offer.collectionIndex = event.params.sellerParams.collectionIndex;
    offer.collection = getOfferCollectionId(
      event.params.sellerId.toString(),
      event.params.sellerParams.collectionIndex.toString()
    );
    const royaltyInfo = event.params.sellerParams.royaltyInfo;
    saveRoyaltyInfo(
      offerId,
      royaltyInfo.recipients,
      royaltyInfo.bps,
      0,
      event.block.timestamp
    );
    offer.save();
  } else {
    log.warning("Unable to find Offer with id '{}'", [offerId]);
  }
}

export function handleBuyerCommittedEvent240(event: BuyerCommitted240): void {
  const exchangeFromEvent = event.params.exchange;
  const exchangeId = exchangeFromEvent.id.toString();

  let exchange = Exchange.load(exchangeId);

  if (!exchange) {
    exchange = new Exchange(exchangeId);
  }

  const offer = Offer.load(exchangeFromEvent.offerId.toString());
  if (offer) {
    offer.quantityAvailable = offer.quantityAvailable.minus(BigInt.fromI32(1));
    offer.numberOfCommits = offer.numberOfCommits.plus(BigInt.fromI32(1));
    offer.save();

    saveMetadata(offer, offer.createdAt);

    exchange.seller = offer.seller as string; // We assume seller is defined when BuyerCommitted is emitted
    exchange.disputeResolver = offer.disputeResolver;
  } else {
    log.warning("Unable to find Offer with id '{}'", [
      exchangeFromEvent.offerId.toString()
    ]);
  }

  exchange.buyer = exchangeFromEvent.buyerId.toString();
  exchange.offer = exchangeFromEvent.offerId.toString();
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = event.params.voucher.committedDate;
  exchange.validUntilDate = event.params.voucher.validUntilDate;
  exchange.expired = false;
  exchange.mutualizerAddress = Address.fromString(ZERO_ADDRESS);

  exchange.save();

  saveExchangeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "BUYER_COMMITTED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId
  );
}

export function handleVoucherRevokedEvent(event: VoucherRevoked): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "REVOKED";
    exchange.revokedDate = event.block.timestamp;
    exchange.finalizedDate = event.block.timestamp;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_REVOKED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleVoucherExpiredEvent(event: VoucherExpired): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "CANCELLED";
    exchange.expired = true;
    exchange.cancelledDate = event.block.timestamp;
    exchange.finalizedDate = event.block.timestamp;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_EXPIRED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleVoucherExtendedEvent(event: VoucherExtended): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.validUntilDate = event.params.validUntil;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_EXTENDED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleVoucherCanceledEvent(event: VoucherCanceled): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "CANCELLED";
    exchange.cancelledDate = event.block.timestamp;
    exchange.finalizedDate = event.block.timestamp;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_CANCELED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleVoucherRedeemedEvent(event: VoucherRedeemed): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    const offer = Offer.load(exchange.offer);

    if (offer) {
      offer.numberOfRedemptions = offer.numberOfRedemptions.plus(
        BigInt.fromI32(1)
      );
      offer.save();

      saveMetadata(offer, offer.createdAt);
    }

    exchange.state = "REDEEMED";
    exchange.redeemedDate = event.block.timestamp;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_REDEEMED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleVoucherTransferredEvent(event: VoucherTransferred): void {
  const exchangeId = event.params.exchangeId;
  const newBuyerId = event.params.newBuyerId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_TRANSFERRED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );

    exchange.buyer = newBuyerId.toString();
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "VOUCHER_TRANSFERRED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleExchangeCompletedEvent(event: ExchangeCompleted): void {
  const exchangeId = event.params.exchangeId;

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "COMPLETED";
    exchange.completedDate = event.block.timestamp;
    exchange.finalizedDate = event.block.timestamp;
    exchange.save();

    saveExchangeEventLogs(
      event.transaction.hash.toHexString(),
      event.logIndex,
      "EXCHANGE_COMPLETED",
      event.block.timestamp,
      event.params.executedBy,
      exchangeId.toString()
    );
  }
}

export function handleConditionalCommitAuthorizedEvent(
  event: ConditionalCommitAuthorized
): void {
  const offer = Offer.load(event.params.offerId.toString());

  if (offer && offer.condition) {
    const offerCondition = ConditionEntity.load(offer.condition as string);
    if (offerCondition) {
      saveConditionalCommitAuthorizedEventLog(
        event.transaction.hash.toHexString(),
        event.logIndex,
        "CONDITIONAL_COMMIT",
        event.block.timestamp,
        event.params.buyerAddress,
        event.params.offerId,
        event.params.commitCount,
        event.params.maxCommits,
        event.params.gating,
        event.params.tokenId,
        offerCondition.id
      );
    }
  }
}
