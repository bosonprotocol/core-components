/* eslint-disable @typescript-eslint/ban-types */
import { log, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  FundsDeposited,
  FundsReleased,
  FundsWithdrawn,
  FundsEncumbered,
  ProtocolFeeCollected as ProtocolFeeCollectedEvent,
  DRFeeRequested
} from "../../generated/BosonFundsHandler/IBosonFundsHandler";
import {
  DRFeeRequestedEvent,
  Exchange,
  FundsEntity,
  ProtocolFeeCollected,
  Seller
} from "../../generated/schema";
import { isZeroAddress, saveExchangeToken } from "../entities/token";
import { saveFundsEventLog } from "../entities/event-log";

export function handleFundsDepositedEvent(event: FundsDeposited): void {
  handleIncreasingFundsEvent(
    event.params.sellerId,
    event.params.amount,
    event.params.tokenAddress
  );

  saveFundsEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "FUNDS_DEPOSITED",
    event.block.timestamp,
    event.params.amount,
    event.params.executedBy,
    event.params.sellerId.toString(),
    getFundsEntityId(event.params.sellerId, event.params.tokenAddress)
  );
}

export function handleFundsReleasedEvent(event: FundsReleased): void {
  handleIncreasingFundsEvent(
    event.params.entityId,
    event.params.amount,
    event.params.exchangeToken
  );

  saveFundsEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "FUNDS_RELEASED",
    event.block.timestamp,
    event.params.amount,
    event.params.executedBy,
    event.params.entityId.toString(),
    getFundsEntityId(event.params.entityId, event.params.exchangeToken)
  );
}

export function handleFundsEncumberedEvent(event: FundsEncumbered): void {
  /**
   * the FundsEncumbered is raised:
    - for buyer to get buyerEscalationDeposit (escalateDispute')),
    - for buyer to get the item price (resulting from the price discovery fulfilment)
           (commitToPriceDiscoveryOffer() or sequentialCommitToOffer()),
    - for seller to get sellerDeposit when offer is buyer initiated and not preminted (commitToOfferInternal()),
    - for buyer to get offer.price when offer is seller initiated and not preminted (commitToOfferInternal()),
    - for buyer to get offer.price when offer is buyer initiated. Funds come from the buyer pool
    - for seller to get sellerDeposit when offer is seller initiated. Funds come from the seller pool
    Entity's pool only needs to be updated in the last 2 cases.
    However there is no information to discriminate these cases from the others.
   */

  handleDecreasingFundsEvent(
    event.params.entityId,
    event.params.amount,
    event.params.exchangeToken
  );

  saveFundsEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "FUNDS_ENCUMBERED",
    event.block.timestamp,
    event.params.amount,
    event.params.executedBy,
    event.params.entityId.toString(),
    getFundsEntityId(event.params.entityId, event.params.exchangeToken)
  );
}

export function handleFundsWithdrawnEvent(event: FundsWithdrawn): void {
  handleDecreasingFundsEvent(
    event.params.sellerId,
    event.params.amount,
    event.params.tokenAddress
  );

  saveFundsEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "FUNDS_WITHDRAWN",
    event.block.timestamp,
    event.params.amount,
    event.params.executedBy,
    event.params.sellerId.toString(),
    getFundsEntityId(event.params.sellerId, event.params.tokenAddress)
  );
}

function handleDecreasingFundsEvent(
  entityId: BigInt,
  amount: BigInt,
  tokenAddress: Address
): void {
  saveExchangeToken(tokenAddress);

  const fundsId = getFundsEntityId(entityId, tokenAddress);
  let fundsEntity = FundsEntity.load(fundsId);

  if (!fundsEntity) {
    // we can't suppose the fundsEntity is necessary existing. For instance
    // if an offer has sellerDeposit == 0, the FundsEncumbered event can be raised
    // when a buyer is committing, even if the seller has never deposited any
    // fund (in which case amount should be 0)
    fundsEntity = new FundsEntity(fundsId);
    fundsEntity.availableAmount = BigInt.zero();
    if (!amount.isZero()) {
      // in case amount is not 0, this means a problem
      log.warning(
        "Fund '{}' can not be decremented by '{}' because it can not exist",
        [fundsId, amount.toString()]
      );
    }
    fundsEntity.tokenAddress = tokenAddress;
    fundsEntity.token = tokenAddress.toHexString();
    fundsEntity.accountId = entityId;
    fundsEntity.account = entityId.toString();
  } else {
    fundsEntity.availableAmount = fundsEntity.availableAmount.minus(amount);
  }
  fundsEntity.save();
}

function handleIncreasingFundsEvent(
  entityId: BigInt,
  amount: BigInt,
  tokenAddress: Address
): void {
  saveExchangeToken(tokenAddress);

  const fundsId = getFundsEntityId(entityId, tokenAddress);
  let fundsEntity = FundsEntity.load(fundsId);

  if (!fundsEntity) {
    fundsEntity = new FundsEntity(fundsId);
    fundsEntity.availableAmount = amount;
    fundsEntity.tokenAddress = tokenAddress;
    fundsEntity.token = tokenAddress.toHexString();
    fundsEntity.accountId = entityId;
    fundsEntity.account = entityId.toString();
  } else {
    fundsEntity.availableAmount = fundsEntity.availableAmount.plus(amount);
  }
  fundsEntity.save();
}

function getFundsEntityId(accountId: BigInt, tokenAddress: Bytes): string {
  return `${accountId.toString()}-${tokenAddress.toHexString()}`;
}

export function handleProtocolFeeCollectedEvent(
  event: ProtocolFeeCollectedEvent
): void {
  const protocolFeeCollectedId = event.params.exchangeId.toString();
  let protocolFeeCollected = ProtocolFeeCollected.load(protocolFeeCollectedId);
  if (protocolFeeCollected) {
    // Warning
    log.warning("protocolFeeCollected already exists with ID {}", [
      protocolFeeCollectedId
    ]);
  } else {
    protocolFeeCollected = new ProtocolFeeCollected(protocolFeeCollectedId);
    protocolFeeCollected.amount = event.params.amount;
    protocolFeeCollected.exchange = event.params.exchangeId.toString();
    protocolFeeCollected.exchangeId = event.params.exchangeId;
    protocolFeeCollected.exchangeToken = event.params.exchangeToken;
    protocolFeeCollected.executedBy = event.params.executedBy;
    protocolFeeCollected.save();
  }
}

export function handleDRFeeRequestedEvent(event: DRFeeRequested): void {
  // Create a DRFeeRequestedEvent entity for post processing
  // (processing the event requires the exchange to already exist)
  const dRFeeRequestedEventId = getDRFeeRequestedEventId(
    event.params.exchangeId
  );
  let dRFeeRequestedEvent = DRFeeRequestedEvent.load(dRFeeRequestedEventId);
  if (dRFeeRequestedEvent) {
    log.error("DRFeeRequestedEvent with ID '{}' already exists!", [
      dRFeeRequestedEventId
    ]);
    return;
  }
  dRFeeRequestedEvent = new DRFeeRequestedEvent(dRFeeRequestedEventId);
  dRFeeRequestedEvent.txHash = event.transaction.hash.toHexString();
  dRFeeRequestedEvent.logIndex = event.logIndex;
  dRFeeRequestedEvent.exchangeId = event.params.exchangeId;
  dRFeeRequestedEvent.tokenAddress = event.params.tokenAddress;
  dRFeeRequestedEvent.feeAmount = event.params.feeAmount;
  dRFeeRequestedEvent.mutualizerAddress = event.params.mutualizerAddress;
  dRFeeRequestedEvent.timestamp = event.block.timestamp;
  dRFeeRequestedEvent.executedBy = event.params.executedBy;
  dRFeeRequestedEvent.save();

  // If the exchange already exists, process the event right now
  const exchange = Exchange.load(event.params.exchangeId.toString());
  if (exchange) {
    const seller = Seller.load(exchange.seller);
    if (!seller) {
      log.warning("Unable to find Seller with id '{}'", [exchange.seller]);
      return;
    }
    processDRFeeRequestedEvent(event.params.exchangeId, seller.sellerId);
  }
}

function getDRFeeRequestedEventId(exchangeId: BigInt): string {
  return `${exchangeId.toString()}`;
}

function findDRFeeRequestedEvent(
  exchangeId: BigInt
): DRFeeRequestedEvent | null {
  const dRFeeRequestedEventId = getDRFeeRequestedEventId(exchangeId);
  const dRFeeRequestedEvent = DRFeeRequestedEvent.load(dRFeeRequestedEventId);
  if (dRFeeRequestedEvent) {
    return dRFeeRequestedEvent;
  }
  log.warning("Unable to find DRFeeRequestedEvent for exchangeId '{}'", [
    exchangeId.toString()
  ]);
  return null;
}

export function processDRFeeRequestedEvent(
  exchangeId: BigInt,
  entityId: BigInt
): void {
  const dRFeeRequestedEvent = findDRFeeRequestedEvent(exchangeId);
  if (!dRFeeRequestedEvent) {
    return;
  }

  // if there is no mutualizerAddress, consider it like FundsEncumberedEvent
  if (isZeroAddress(dRFeeRequestedEvent.mutualizerAddress.toHexString())) {
    log.info("handleDRFeeRequestedEvent entityId:{}, amount:{}, token:{}", [
      entityId.toString(),
      dRFeeRequestedEvent.feeAmount.toString(),
      dRFeeRequestedEvent.tokenAddress.toString()
    ]);
    handleDecreasingFundsEvent(
      entityId,
      dRFeeRequestedEvent.feeAmount,
      Address.fromBytes(dRFeeRequestedEvent.tokenAddress)
    );
    saveFundsEventLog(
      dRFeeRequestedEvent.txHash,
      dRFeeRequestedEvent.logIndex,
      "FUNDS_ENCUMBERED",
      dRFeeRequestedEvent.timestamp,
      dRFeeRequestedEvent.feeAmount,
      dRFeeRequestedEvent.executedBy,
      entityId.toString(),
      getFundsEntityId(entityId, dRFeeRequestedEvent.tokenAddress)
    );
  } else {
    // TODO: check how to interpret the event in case of mutualized DR fees
  }
}
