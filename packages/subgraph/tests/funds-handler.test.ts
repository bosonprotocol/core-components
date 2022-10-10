import {
  beforeEach,
  test,
  assert,
  clearStore
} from "matchstick-as/assembly/index";
import {
  handleFundsDepositedEvent,
  handleFundsWithdrawnEvent,
  handleFundsEncumberedEvent,
  handleFundsReleasedEvent
} from "../src/mappings/funds-handler";
import { handleSellerCreatedEvent } from "../src/mappings/account-handler";
import {
  createFundsDepositedEvent,
  createFundsEncumberedEvent,
  createFundsReleasedEvent,
  createFundsWithdrawnEvent,
  createSellerCreatedEvent,
  mockBosonVoucherContractCalls
} from "./mocks";

const sellerId = 1;
const buyerId = 2;
const exchangeId = 3;
const sellerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
const tokenAddress = "0x0000000000000000000000000000000000000000";
const voucherCloneAddress = "0x123456789a123456789a123456789a123456789a";

beforeEach(() => {
  clearStore();
});

test("handle FundsDepositedEvent", () => {
  const fundsDepositedEvent = createFundsDepositedEvent(
    sellerId,
    sellerAddress,
    tokenAddress,
    100
  );

  handleFundsDepositedEvent(fundsDepositedEvent);

  const fundsId = getFundsId(sellerId, tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "100");
  assert.fieldEquals("FundsEntity", fundsId, "tokenAddress", tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "accountId", sellerId.toString());
});

test("handle FundsReleasedEvent", () => {
  const fundsReleasedEvent = createFundsReleasedEvent(
    exchangeId,
    buyerId,
    tokenAddress,
    200,
    sellerAddress
  );

  handleFundsReleasedEvent(fundsReleasedEvent);

  const fundsId = getFundsId(buyerId, tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "200");
  assert.fieldEquals("FundsEntity", fundsId, "tokenAddress", tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "accountId", buyerId.toString());
});

test("handle FundsEncumberedEvent", () => {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 1);
  handleSellerCreatedEvent(
    createSellerCreatedEvent(
      sellerId,
      sellerAddress,
      sellerAddress,
      sellerAddress,
      sellerAddress,
      voucherCloneAddress,
      0,
      0,
      sellerAddress
    )
  );
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
    10,
    sellerAddress
  );
  handleFundsEncumberedEvent(fundsEncumberedEvent);

  const fundsId = getFundsId(sellerId, tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "90");
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
    10,
    sellerAddress
  );
  handleFundsWithdrawnEvent(fundsWithdrawnEvent);

  const fundsId = getFundsId(sellerId, tokenAddress);
  assert.fieldEquals("FundsEntity", fundsId, "id", fundsId);
  assert.fieldEquals("FundsEntity", fundsId, "availableAmount", "90");
});

function getFundsId(entityId: i32, tokenAddress: string): string {
  return entityId.toString() + "-" + tokenAddress;
}
