import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AccountEventLog,
  OfferEventLog,
  ExchangeEventLog,
  FundsEventLog,
  DisputeEventLog,
  Exchange
} from "../../generated/schema";

export function getEventLogId(
  txHash: string,
  logIndex: BigInt,
  accountId: string
): string {
  return `${txHash}-${logIndex}-${accountId}`;
}

export function saveAccountEventLog(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  accountId: string
): string {
  const eventLogId = getEventLogId(txHash, logIndex, accountId);

  let eventLog = AccountEventLog.load(eventLogId);

  if (!eventLog) {
    eventLog = new AccountEventLog(eventLogId);
  }

  eventLog.type = type;
  eventLog.hash = txHash;
  eventLog.timestamp = timestamp;
  eventLog.executedBy = executedBy;
  eventLog.account = accountId;
  eventLog.save();

  return eventLogId;
}

export function saveOfferEventLog(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  accountId: string,
  offerId: string
): string {
  const eventLogId = getEventLogId(txHash, logIndex, accountId);

  let eventLog = OfferEventLog.load(eventLogId);

  if (!eventLog) {
    eventLog = new OfferEventLog(eventLogId);
  }

  eventLog.type = type;
  eventLog.hash = txHash;
  eventLog.timestamp = timestamp;
  eventLog.executedBy = executedBy;
  eventLog.account = accountId;
  eventLog.offer = offerId;
  eventLog.save();

  return eventLogId;
}

export function saveExchangeEventLogs(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  exchangeId: string
): void {
  const exchange = Exchange.load(exchangeId);

  if (exchange) {
    saveExchangeEventLog(
      txHash,
      logIndex,
      type,
      timestamp,
      executedBy,
      exchange.buyer,
      exchangeId
    );
    saveExchangeEventLog(
      txHash,
      logIndex,
      type,
      timestamp,
      executedBy,
      exchange.seller,
      exchangeId
    );
  }
}

function saveExchangeEventLog(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  accountId: string,
  exchangeId: string
): string {
  const eventLogId = getEventLogId(txHash, logIndex, accountId);

  let eventLog = ExchangeEventLog.load(eventLogId);

  if (!eventLog) {
    eventLog = new ExchangeEventLog(eventLogId);
  }

  eventLog.type = type;
  eventLog.hash = txHash;
  eventLog.timestamp = timestamp;
  eventLog.executedBy = executedBy;
  eventLog.account = accountId;
  eventLog.exchange = exchangeId;
  eventLog.save();

  return eventLogId;
}

export function saveFundsEventLog(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  accountId: string,
  fundsId: string
): string {
  const eventLogId = getEventLogId(txHash, logIndex, accountId);

  let eventLog = FundsEventLog.load(eventLogId);

  if (!eventLog) {
    eventLog = new FundsEventLog(eventLogId);
  }

  eventLog.type = type;
  eventLog.hash = txHash;
  eventLog.timestamp = timestamp;
  eventLog.executedBy = executedBy;
  eventLog.account = accountId;
  eventLog.funds = fundsId;
  eventLog.save();

  return eventLogId;
}

export function saveDisputeEventLogs(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  disputeId: string
): void {
  const exchange = Exchange.load(disputeId);

  if (exchange) {
    saveDisputeEventLog(
      txHash,
      logIndex,
      type,
      timestamp,
      executedBy,
      exchange.buyer,
      disputeId
    );
    saveDisputeEventLog(
      txHash,
      logIndex,
      type,
      timestamp,
      executedBy,
      exchange.seller,
      disputeId
    );
    saveDisputeEventLog(
      txHash,
      logIndex,
      type,
      timestamp,
      executedBy,
      exchange.disputeResolver,
      disputeId
    );
  }
}

function saveDisputeEventLog(
  txHash: string,
  logIndex: BigInt,
  type: string,
  timestamp: BigInt,
  executedBy: Bytes,
  accountId: string,
  disputeId: string
): string {
  const eventLogId = getEventLogId(txHash, logIndex, accountId);

  let eventLog = DisputeEventLog.load(eventLogId);

  if (!eventLog) {
    eventLog = new DisputeEventLog(eventLogId);
  }

  eventLog.type = type;
  eventLog.hash = txHash;
  eventLog.timestamp = timestamp;
  eventLog.executedBy = executedBy;
  eventLog.account = accountId;
  eventLog.dispute = disputeId;
  eventLog.save();

  return eventLogId;
}
