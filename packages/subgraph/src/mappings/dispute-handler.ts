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

export function handleDisputeRaisedEvent(event: DisputeRaised): void {
  const exchangeId = event.params.exchangeId;
  const buyerId = event.params.buyerId;
  const sellerId = event.params.sellerId;
  const complaint = event.params.complaint;

  const disputeHandler = IBosonDisputeHandler.bind(event.address);
  const getDisputeResult = disputeHandler.getDispute(exchangeId);
  const disputeStruct = getDisputeResult.value1;
  const disputeDurations = getDisputeResult.value2;

  const disputeId = exchangeId.toString();

  let dispute = Dispute.load(disputeId);

  if (!dispute) {
    dispute = new Dispute(disputeId);
  }

  dispute.exchangeId = exchangeId;
  dispute.exchange = exchangeId.toString();
  dispute.complaint = complaint;
  dispute.state = "RESOLVING";
  dispute.buyerPercent = disputeStruct.buyerPercent;
  dispute.disputedDate = disputeDurations.disputed;
  dispute.timeout = disputeDurations.timeout;
  dispute.seller = sellerId.toString();
  dispute.buyer = buyerId.toString();
  dispute.save();

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.state = "DISPUTED";
    exchange.disputed = true;
    exchange.save();
  }
}

export function handleDisputeRetractedEvent(event: DisputeRetracted): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RETRACTED");
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
}

export function handleDisputeExpiredEvent(event: DisputeExpired): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RETRACTED");
}

export function handleDisputeResolvedEvent(event: DisputeResolved): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "RESOLVED");
}

export function handleDisputeEscalatedEvent(event: DisputeEscalated): void {
  const exchangeId = event.params.exchangeId;

  const disputeHandler = IBosonDisputeHandler.bind(event.address);
  const getDisputeResult = disputeHandler.getDispute(exchangeId);
  const disputeFromContract = getDisputeResult.value1;
  const disputeDurations = getDisputeResult.value2;

  const disputeId = exchangeId.toString();

  const dispute = Dispute.load(disputeId);

  if (dispute) {
    dispute.state = "ESCALATED";
    dispute.escalatedDate = disputeDurations.escalated;
    dispute.timeout = disputeDurations.timeout;
    dispute.save();
  }
}

export function handleDisputeDecidedEvent(event: DisputeDecided): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "DECIDED");
}

export function handleEscalatedDisputeRefusedEvent(
  event: EscalatedDisputeRefused
): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "REFUSED");
}

export function handleEscalatedDisputeExpiredEvent(
  event: EscalatedDisputeRefused
): void {
  const exchangeId = event.params.exchangeId;

  finalizeDispute(event.address, exchangeId, "REFUSED");
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
    dispute.save();
  }

  const exchange = Exchange.load(exchangeId.toString());

  if (exchange) {
    exchange.finalizedDate = disputeDurations.finalized;
    exchange.save();
  }
}
