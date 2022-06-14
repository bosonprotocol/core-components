import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  FundsDeposited,
  FundsReleased,
  FundsWithdrawn,
  FundsEncumbered
} from "../../generated/BosonFundsHandler/IBosonFundsHandler";
import { FundsEntity } from "../../generated/schema";
import { saveExchangeToken } from "../entities/token";

export function handleFundsDepositedEvent(event: FundsDeposited): void {
  handleIncreasingFundsEvent(
    event.params.sellerId,
    event.params.amount,
    event.params.tokenAddress
  );
}

export function handleFundsReleasedEvent(event: FundsReleased): void {
  handleIncreasingFundsEvent(
    event.params.entityId,
    event.params.amount,
    event.params.exchangeToken
  );
}

export function handleFundsEncumberedEvent(event: FundsEncumbered): void {
  handleDecreasingFundsEvent(
    event.params.entityId,
    event.params.amount,
    event.params.exchangeToken
  );
}

export function handleFundsWithdrawnEvent(event: FundsWithdrawn): void {
  handleDecreasingFundsEvent(
    event.params.sellerId,
    event.params.amount,
    event.params.tokenAddress
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
