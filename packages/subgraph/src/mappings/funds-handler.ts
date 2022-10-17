import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  FundsDeposited,
  FundsReleased,
  FundsWithdrawn,
  FundsEncumbered
} from "../../generated/BosonFundsHandler/IBosonFundsHandler";
import { FundsEntity, Seller } from "../../generated/schema";
import { saveExchangeToken } from "../entities/token";
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
    event.params.executedBy,
    event.params.entityId.toString(),
    getFundsEntityId(event.params.entityId, event.params.exchangeToken)
  );
}

export function handleFundsEncumberedEvent(event: FundsEncumbered): void {
  const seller = Seller.load(event.params.entityId.toString());

  if (seller) {
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
      event.params.executedBy,
      event.params.entityId.toString(),
      getFundsEntityId(event.params.entityId, event.params.exchangeToken)
    );
  }
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
  const fundsEntity = FundsEntity.load(fundsId);

  if (fundsEntity) {
    fundsEntity.availableAmount = fundsEntity.availableAmount.minus(amount);
    fundsEntity.save();
  }
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
