import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  DisputeDecided,
  DisputeEscalated,
  DisputeExpired,
  DisputeRaised,
  DisputeResolved,
  DisputeRetracted,
  DisputeTimeoutExtended,
  EscalatedDisputeRefused,
  IBosonDisputeHandler
} from "../../generated/BosonDisputeHandler/IBosonDisputeHandler";
import { Dispute, Exchange } from "../../generated/schema";

import { saveDisputeEventLogs } from "../entities/event-log";

export function handleDisputeRaisedEvent(event: DisputeRaised): void {
  const exchangeId = event.params.exchangeId;
  const buyerId = event.params.buyerId;
  const sellerId = event.params.sellerId;

  const disputeHandler = IBosonDisputeHandler.bind(event.address);
  const getDisputeResult = disputeHandler.getDispute(exchangeId);
  const disputeStruct = getDisputeResult.value1;
  const disputeDurations = getDisputeResult.value2;

  const disputeId = exchangeId.toString();

  let dispute = Dispute.load(disputeId);

  if (!dispute) {
    dispute = new Dispute(disputeId);
  }

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "DISPUTED";
    exchange.disputedDate = event.block.timestamp;
    exchange.disputed = true;
    exchange.dispute = disputeId;
    exchange.save();

    dispute.disputeResolver = exchange.disputeResolver;
  }

  dispute.exchangeId = exchangeId;
  dispute.exchange = exchangeId.toString();
  dispute.state = "RESOLVING";
  dispute.buyerPercent = disputeStruct.buyerPercent;
  dispute.disputedDate = disputeDurations.disputed;
  dispute.timeout = disputeDurations.timeout;
  dispute.seller = sellerId.toString();
  dispute.buyer = buyerId.toString();
  dispute.save();

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RAISED",
    event.block.timestamp,
    event.params.executedBy,
    disputeId
  );
}

export function handleDisputeRetractedEvent(event: DisputeRetracted): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RETRACTED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RETRACTED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleDisputeTimeoutExtendedEvent(
  event: DisputeTimeoutExtended
): void {
  const exchangeId = event.params.exchangeId;
  const newDisputeTimeout = event.params.newDisputeTimeout;
  const disputeId = exchangeId.toString();

  const dispute = Dispute.load(disputeId);

  if (dispute) {
    dispute.timeout = newDisputeTimeout;
    dispute.save();
  }

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_TIMEOUT_EXTENDED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleDisputeExpiredEvent(event: DisputeExpired): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RETRACTED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_EXPIRED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleDisputeResolvedEvent(event: DisputeResolved): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RESOLVED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleDisputeEscalatedEvent(event: DisputeEscalated): void {
  const exchangeId = event.params.exchangeId;

  const disputeHandler = IBosonDisputeHandler.bind(event.address);
  const getDisputeResult = disputeHandler.getDispute(exchangeId);
  const disputeDurations = getDisputeResult.value2;

  const disputeId = exchangeId.toString();

  const dispute = Dispute.load(disputeId);

  if (dispute) {
    dispute.state = "ESCALATED";
    dispute.escalatedDate = disputeDurations.escalated;
    dispute.timeout = disputeDurations.timeout;
    dispute.save();
  }

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_ESCALATED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleDisputeDecidedEvent(event: DisputeDecided): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "DECIDED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_DECIDED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleEscalatedDisputeRefusedEvent(
  event: EscalatedDisputeRefused
): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "REFUSED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ESCALATED_DISPUTE_REFUSED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

export function handleEscalatedDisputeExpiredEvent(
  event: EscalatedDisputeRefused
): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "REFUSED");

  saveDisputeEventLogs(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ESCALATED_DISPUTE_EXPIRED",
    event.block.timestamp,
    event.params.executedBy,
    exchangeId.toString()
  );
}

function finalizeDispute(
  address: Address,
  exchangeId: BigInt,
  targetState: string
): void {
  const disputeHandler = IBosonDisputeHandler.bind(address);
  const getDisputeResult = disputeHandler.getDispute(exchangeId);
  const disputeFromContract = getDisputeResult.value1;
  const disputeDurations = getDisputeResult.value2;

  const disputeId = exchangeId.toString();

  const dispute = Dispute.load(disputeId);

  if (dispute) {
    dispute.state = targetState;
    dispute.finalizedDate = disputeDurations.finalized;
    dispute.buyerPercent = disputeFromContract.buyerPercent;

    if (targetState === "RETRACTED") {
      dispute.retractedDate = disputeDurations.finalized;
    } else if (targetState === "RESOLVED") {
      dispute.resolvedDate = disputeDurations.finalized;
    } else if (targetState === "DECIDED") {
      dispute.decidedDate = disputeDurations.finalized;
    } else if (targetState === "REFUSED") {
      dispute.refusedDate = disputeDurations.finalized;
    }

    dispute.save();
  }

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.finalizedDate = disputeDurations.finalized;
    exchange.save();
  }
}
