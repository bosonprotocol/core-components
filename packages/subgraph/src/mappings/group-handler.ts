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
  condition.tokenId = conditionFromEvent.tokenId;
  condition.threshold = conditionFromEvent.threshold;
  condition.maxCommits = conditionFromEvent.maxCommits;
  condition.length = conditionFromEvent.tokenLength; // <-- adding length property in the event is failing (because already existing at the Array type)
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
  condition.tokenId = conditionFromEvent.tokenId;
  condition.threshold = conditionFromEvent.threshold;
  condition.maxCommits = conditionFromEvent.maxCommits;
  // TODO: to be fixed when protocol v2.3.0 dep is up-to-date
  condition.length = BigInt.fromI32(0); // length does not exist in GroupCreatedLegacy event (< v2.3.0)
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
