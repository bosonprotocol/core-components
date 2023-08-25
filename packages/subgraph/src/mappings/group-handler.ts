import { BigInt } from "@graphprotocol/graph-ts";
import { ConditionEntity } from "./../../generated/schema";
import { Offer } from "../../generated/schema";
import {
  GroupCreated,
  GroupUpdated
} from "../../generated/BosonGroupHandler/IBosonGroupHandler";
import {
  GroupCreated as GroupCreatedLegacy,
  GroupUpdated as GroupUpdatedLegacy
} from "../../generated/BosonGroupHandlerLegacy/IBosonGroupHandlerLegacy";

export function handleGroupCreatedEvent(event: GroupCreated): void {
  const groupId = event.params.groupId;
  const groupFromEvent = event.params.group;
  const conditionFromEvent = event.params.condition;

  // create a Condition Entity (identified with groupId)
  let condition = ConditionEntity.load(groupId.toString());
  if (!condition) {
    condition = new ConditionEntity(groupId.toString());
  }
  condition.method = conditionFromEvent.method;
  condition.tokenType = conditionFromEvent.tokenType;
  condition.tokenAddress = conditionFromEvent.tokenAddress;
  condition.gatingType = conditionFromEvent.gating;
  condition.minTokenId = conditionFromEvent.minTokenId;
  condition.maxTokenId = conditionFromEvent.maxTokenId;
  condition.threshold = conditionFromEvent.threshold;
  condition.maxCommits = conditionFromEvent.maxCommits;
  condition.save();

  // find the offers and update them: isConditional = true?, condition = Condition
  for (let i = 0; i < groupFromEvent.offerIds.length; i++) {
    const offerId = groupFromEvent.offerIds[i];
    const offer = Offer.load(offerId.toString());
    if (offer) {
      offer.condition = groupId.toString();
      offer.save();
    }
  }
  // TODO: record Created group event ?
}

// GroupUpdated event is raised when:
// - offers are added to the group
// - offers are removed from the group
// - group condition is modified
export function handleGroupUpdatedEvent(event: GroupUpdated): void {
  const groupId = event.params.groupId;

  // TODO: find the Condition
  // Update the condition
  // TODO: find the offers that were associated to this condition
  // in case they are not associated anymore, remove the condition for the offer
  // TODO: find the offers that are now associated to this condition and were not before
  // add the condition for the offer
}

export function handleGroupCreatedEventLegacy(event: GroupCreatedLegacy): void {
  const groupId = event.params.groupId;
  const groupFromEvent = event.params.group;
  const conditionFromEvent = event.params.condition;

  // create a Condition Entity (identified with groupId)
  let condition = ConditionEntity.load(groupId.toString());
  if (!condition) {
    condition = new ConditionEntity(groupId.toString());
  }
  condition.method = conditionFromEvent.method;
  condition.tokenType = conditionFromEvent.tokenType;
  condition.tokenAddress = conditionFromEvent.tokenAddress;
  condition.minTokenId = conditionFromEvent.tokenId; // minTokenId does not exist in GroupCreatedLegacy event (< v2.3.0)
  condition.maxTokenId = conditionFromEvent.tokenId; // maxTokenId does not exist in GroupCreatedLegacy event (< v2.3.0)
  condition.gatingType = 0; // gating does not exist in GroupCreatedLegacy event (< v2.3.0)
  condition.threshold = conditionFromEvent.threshold;
  condition.maxCommits = conditionFromEvent.maxCommits;
  condition.save();

  // find the offers and update them: isConditional = true?, condition = Condition
  for (let i = 0; i < groupFromEvent.offerIds.length; i++) {
    const offerId = groupFromEvent.offerIds[i];
    const offer = Offer.load(offerId.toString());
    if (offer) {
      offer.condition = groupId.toString();
      offer.save();
    }
  }
  // TODO: record Created group event ?
}

// GroupUpdated event is raised when:
// - offers are added to the group
// - offers are removed from the group
// - group condition is modified
export function handleGroupUpdatedEventLegacy(event: GroupUpdatedLegacy): void {
  const groupId = event.params.groupId;

  // TODO: find the Condition
  // Update the condition
  // TODO: find the offers that were associated to this condition
  // in case they are not associated anymore, remove the condition for the offer
  // TODO: find the offers that are now associated to this condition and were not before
  // add the condition for the offer
}
