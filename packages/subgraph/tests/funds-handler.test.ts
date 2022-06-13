import { test, assert, clearStore } from "matchstick-as/assembly/index";
import {
  handleFundsDepositedEvent,
  handleFundsWithdrawnEvent,
  handleFundsEncumberedEvent,
  handleFundsReleasedEvent
} from "../src/mappings/funds-handler";
import {
  createFundsDepositedEvent,
  createFundsEncumberedEvent,
  createFundsReleasedEvent,
  createFundsWithdrawnEvent
} from "./mocks";

const sellerId = 1;
const buyerId = 2;
const exchangeId = 3;
const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const tokenAddress = "0x0000000000000000000000000000000000000000";

test("handle FundsDepositedEvent", () => {
  const fundsDepositedEvent = createFundsDepositedEvent(
    sellerId,
    sellerAddress,
    tokenAddress,
    100
  );

  handleFundsDepositedEvent(fundsDepositedEvent);

  const fundsId = sellerId.toString() + tokenAddress;
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "100");
  assert.fieldEquals("FundsEntity", fundsId, "tokenAddress", tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "accountId", sellerId.toString());

  clearStore();
});

test("handle FundsReleasedEvent", () => {
  const fundsReleasedEvent = createFundsReleasedEvent(
    exchangeId,
    buyerId,
    tokenAddress,
    200
  );

  handleFundsReleasedEvent(fundsReleasedEvent);

  const fundsId = buyerId.toString() + tokenAddress;
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "200");
  assert.fieldEquals("FundsEntity", fundsId, "tokenAddress", tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "accountId", buyerId.toString());

  clearStore();
});

test("handle FundsEncumberedEvent", () => {
  const fundsDepositedEvent = createFundsDepositedEvent(
    sellerId,
    sellerAddress,
    tokenAddress,
    100
  );
  handleFundsDepositedEvent(fundsDepositedEvent);

  const fundsEncumberedEvent = createFundsEncumberedEvent(
    sellerId,
    tokenAddress,
    10
  );
  handleFundsEncumberedEvent(fundsEncumberedEvent);

  const fundsId = sellerId.toString() + tokenAddress;
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "90");

  clearStore();
});

test("handle FundsWithdrawnEvent", () => {
  const fundsDepositedEvent = createFundsDepositedEvent(
    sellerId,
    sellerAddress,
    tokenAddress,
    100
  );
  handleFundsDepositedEvent(fundsDepositedEvent);

  const fundsWithdrawnEvent = createFundsWithdrawnEvent(
    sellerId,
    sellerAddress,
    tokenAddress,
    10
  );
  handleFundsWithdrawnEvent(fundsWithdrawnEvent);

  const fundsId = sellerId.toString() + tokenAddress;
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "90");

  clearStore();
});
