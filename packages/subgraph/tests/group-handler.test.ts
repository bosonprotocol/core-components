import { test, assert } from "matchstick-as/assembly/index";
import { handleGroupCreatedEvent, handleGroupUpdatedEvent } from "../src/mappings/group-handler";
import { createGroupCreatedEvent, createGroupUpdatedEvent, mockOffer } from "./mocks";
import { Offer } from "../generated/schema";

const groupId = 1;
const sellerId = 2;
const offerIds = [3, 4, 5];
const offerIds_2 = [6, 7];
const method = i8(0);
const tokenType = i8(1);
const tokenAddress = "0x0123456789012345678901234567890123456789";
const tokenAddress_2 = "0x0123456789012345678901234567890000000000";
const gating = i8(2);
const minTokenId = 123;
const maxTokenId = 456;
const threshold = 6;
const maxCommits = 7;
const executedBy = "0x0abcdef1234567890abcdef12345678901234567";

test("handle GroupCreated event", () => {
  for (let i = 0; i < offerIds.length; i++) {
    const offerId = offerIds[i];
    mockOffer(offerId.toString(), sellerId.toString());
    checkOfferHasNoCondition(offerId.toString());
  }
  const groupCreatedEvent = createGroupCreatedEvent(
    groupId,
    sellerId,
    offerIds,
    method,
    tokenType,
    tokenAddress,
    gating,
    minTokenId,
    threshold,
    maxCommits,
    maxTokenId,
    executedBy
  );
  handleGroupCreatedEvent(groupCreatedEvent);
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "id",
    groupId.toString()
  );
  for (let i = 0; i < offerIds.length; i++) {
    const offerId = offerIds[i];
    assert.fieldEquals(
      "Offer",
      offerId.toString(),
      "condition",
      groupId.toString()
    );
  }
});

test("handle GroupUpdated event", () => {
  for (let i = 0; i < offerIds.length; i++) {
    const offerId = offerIds[i];
    mockOffer(offerId.toString(), sellerId.toString());
    checkOfferHasNoCondition(offerId.toString());
  }
  for (let i = 0; i < offerIds_2.length; i++) {
    const offerId = offerIds_2[i];
    mockOffer(offerId.toString(), sellerId.toString());
    checkOfferHasNoCondition(offerId.toString());
  }
  const groupCreatedEvent = createGroupCreatedEvent(
    groupId,
    sellerId,
    offerIds,
    method,
    tokenType,
    tokenAddress,
    gating,
    minTokenId,
    threshold,
    maxCommits,
    maxTokenId,
    executedBy
  );
  handleGroupCreatedEvent(groupCreatedEvent);
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "id",
    groupId.toString()
  );
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "tokenAddress",
    tokenAddress
  );
  for (let i = 0; i < offerIds.length; i++) {
    const offerId = offerIds[i];
    assert.fieldEquals(
      "Offer",
      offerId.toString(),
      "condition",
      groupId.toString()
    );
  }
  const groupUpdatedEvent = createGroupUpdatedEvent(
    groupId,
    sellerId,
    offerIds_2,
    method,
    tokenType,
    tokenAddress_2,
    gating,
    minTokenId,
    threshold,
    maxCommits,
    maxTokenId,
    executedBy
  );
  handleGroupUpdatedEvent(groupUpdatedEvent);
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "id",
    groupId.toString()
  );
  assert.fieldEquals(
    "ConditionEntity",
    groupId.toString(),
    "tokenAddress",
    tokenAddress_2
  );
  for (let i = 0; i < offerIds_2.length; i++) {
    const offerId = offerIds_2[i];
    assert.fieldEquals(
      "Offer",
      offerId.toString(),
      "condition",
      groupId.toString()
    );
  }
});

function checkOfferHasNoCondition(offerId: string): void {
  const offer = Offer.load(offerId);
  assert.assertNotNull(offer);
  const condition = (offer as Offer).condition;
  assert.assertNull(condition);
}
