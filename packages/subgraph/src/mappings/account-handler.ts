import {
  SellerCreated,
  SellerUpdated,
  BuyerCreated,
  DisputeResolverCreated,
  DisputeResolverActivated,
  DisputeResolverUpdated,
  AllowedSellersAdded,
  AllowedSellersRemoved,
  DisputeResolverFeesAdded,
  DisputeResolverFeesRemoved
} from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import { Seller, Buyer } from "../../generated/schema";

import {
  getAndSaveDisputeResolver,
  getAndSaveDisputeResolverFees
} from "../entities/dispute-resolution";
import { saveAccountEventLog } from "../entities/event-log";

export function handleSellerCreatedEvent(event: SellerCreated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.sellerId = event.params.sellerId;
  seller.operator = sellerFromEvent.operator;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.voucherCloneAddress = event.params.voucherCloneAddress;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = true;
  seller.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
}

export function handleSellerUpdatedEvent(event: SellerUpdated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.operator = sellerFromEvent.operator;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = sellerFromEvent.active;
  seller.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
}

export function handleBuyerCreatedEvent(event: BuyerCreated): void {
  const buyerFromEvent = event.params.buyer;
  const buyerId = buyerFromEvent.id.toString();

  let buyer = Buyer.load(buyerId);

  if (!buyer) {
    buyer = new Buyer(buyerId);
  }

  buyer.wallet = buyerFromEvent.wallet;
  buyer.active = true;
  buyer.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "BUYER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    buyerId
  );
}

export function handleDisputeResolverCreatedEvent(
  event: DisputeResolverCreated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverUpdatedEvent(
  event: DisputeResolverUpdated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverActivatedEvent(
  event: DisputeResolverActivated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_ACTIVATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverFeesAddedEvent(
  event: DisputeResolverFeesAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_FEES_ADDED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverFeesRemovedEvent(
  event: DisputeResolverFeesRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_FEES_REMOVED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleAllowedSellersAddedEvent(
  event: AllowedSellersAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ALLOWED_SELLERS_ADDED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleAllowedSellersRemovedEvent(
  event: AllowedSellersRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ALLOWED_SELLERS_REMOVED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}
