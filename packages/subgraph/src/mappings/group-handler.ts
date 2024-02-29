/* eslint-disable @typescript-eslint/ban-types */
import { BigInt, log } from "@graphprotocol/graph-ts";
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
  addOffersCondition(groupId.toString(), groupFromEvent.offerIds);
  // TODO: record Created group event ?
}

// GroupUpdated event is raised when:
// - offers are added to the group
// - offers are removed from the group
// - group condition is modified
export function handleGroupUpdatedEvent(event: GroupUpdated): void {
  const groupId = event.params.groupId;
  const groupFromEvent = event.params.group;
  const conditionFromEvent = event.params.condition;

  const condition = ConditionEntity.load(groupId.toString());
  if (condition) {
    condition.method = conditionFromEvent.method;
    condition.tokenType = conditionFromEvent.tokenType;
    condition.tokenAddress = conditionFromEvent.tokenAddress;
    condition.gatingType = conditionFromEvent.gating;
    condition.minTokenId = conditionFromEvent.minTokenId;
    condition.maxTokenId = conditionFromEvent.maxTokenId;
    condition.threshold = conditionFromEvent.threshold;
    condition.maxCommits = conditionFromEvent.maxCommits;
    condition.save();
    const previousOffers = condition.offers;
    if (previousOffers) {
      clearPreviousOffersCondition(previousOffers);
    }
  } else {
    log.warning("Not found ConditionEntity with ID '{}'", [groupId.toString()]);
  }

  // find the offers and update them: condition = Condition
  addOffersCondition(groupId.toString(), groupFromEvent.offerIds);
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
  addOffersCondition(groupId.toString(), groupFromEvent.offerIds);
  // TODO: record Created group event ?
}

// GroupUpdated event is raised when:
// - offers are added to the group
// - offers are removed from the group
// - group condition is modified
export function handleGroupUpdatedEventLegacy(event: GroupUpdatedLegacy): void {
  const groupId = event.params.groupId;
  const groupFromEvent = event.params.group;
  const conditionFromEvent = event.params.condition;

  // create a Condition Entity (identified with groupId)
  const condition = ConditionEntity.load(groupId.toString());
  if (condition) {
    condition.method = conditionFromEvent.method;
    condition.tokenType = conditionFromEvent.tokenType;
    condition.tokenAddress = conditionFromEvent.tokenAddress;
    condition.minTokenId = conditionFromEvent.tokenId; // minTokenId does not exist in GroupCreatedLegacy event (< v2.3.0)
    condition.maxTokenId = conditionFromEvent.tokenId; // maxTokenId does not exist in GroupCreatedLegacy event (< v2.3.0)
    condition.gatingType = 0; // gating does not exist in GroupCreatedLegacy event (< v2.3.0)
    condition.threshold = conditionFromEvent.threshold;
    condition.maxCommits = conditionFromEvent.maxCommits;
    condition.save();
    const previousOffers = condition.offers;
    if (previousOffers) {
      clearPreviousOffersCondition(previousOffers);
    }
  } else {
    log.warning("Not found ConditionEntity with ID '{}'", [groupId.toString()]);
  }

  // find the offers and update them: isConditional = true?, condition = Condition
  addOffersCondition(groupId.toString(), groupFromEvent.offerIds);
}

function clearPreviousOffersCondition(previousOffers: string[]): void {
  for (let i = 0; i < previousOffers.length; i++) {
    const offerId = previousOffers[i];
    const offer = Offer.load(offerId.toString());
    if (offer) {
      offer.condition = null;
      offer.save();
    } else {
      log.warning("Unable to load Offer with ID '{}'", [offerId.toString()]);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function addOffersCondition(conditionId: string, offerIds: BigInt[]): void {
  for (let i = 0; i < offerIds.length; i++) {
    const offerId = offerIds[i];
    const offer = Offer.load(offerId.toString());
    if (offer) {
      offer.condition = conditionId;
      offer.save();
    }
  }
}
