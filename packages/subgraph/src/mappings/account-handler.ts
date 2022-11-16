/* eslint-disable @typescript-eslint/ban-types */
import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import {
  SellerCreated,
  SellerUpdated,
  SellerUpdatePending,
  SellerUpdateApplied,
  BuyerCreated,
  DisputeResolverCreated,
  DisputeResolverActivated,
  DisputeResolverUpdated,
  AllowedSellersAdded,
  AllowedSellersRemoved,
  DisputeResolverFeesAdded,
  DisputeResolverFeesRemoved,
  DisputeResolverUpdateApplied,
  DisputeResolverUpdatePending
} from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import { IBosonVoucher } from "../../generated/BosonAccountHandler/IBosonVoucher";
import { Seller, Buyer, PendingSeller } from "../../generated/schema";

import {
  getAndSaveDisputeResolver,
  getAndSaveDisputeResolverFees
} from "../entities/dispute-resolution";
import { saveAccountEventLog } from "../entities/event-log";

export function handleSellerCreatedEvent(event: SellerCreated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  const bosonVoucherContract = IBosonVoucher.bind(
    event.params.voucherCloneAddress
  );

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
  seller.contractURI = bosonVoucherContract.contractURI();
  seller.royaltyPercentage = bosonVoucherContract.getRoyaltyPercentage();
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

// Keep handleSellerUpdatedEvent for compatibility with v2.0.0
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

export function handleSellerUpdatePendingEvent(
  event: SellerUpdatePending
): void {
  const pendingSellerFromEvent = event.params.pendingSeller;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  pendingSeller.operator = pendingSellerFromEvent.operator;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.save();
}

export function handleSellerUpdateAppliedEvent(
  event: SellerUpdateApplied
): void {
  const sellerFromEvent = event.params.seller;
  const pendingSellerFromEvent = event.params.pendingSeller;
  const authTokenFromEvent = event.params.authToken;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
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
  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  pendingSeller.operator = pendingSellerFromEvent.operator;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.save();

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

// Keep handleSellerUpdatedEvent for compatibility with v2.0.0
export function handleDisputeResolverUpdatedEvent(
  event: DisputeResolverUpdated
): void {
  const disputeResolverId = event.params.disputeResolverId;

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

export function handleDisputeResolverUpdatePendingEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: DisputeResolverUpdatePending
): void {
  log.error(
    "handleDisputeResolverUpdatePendingEvent() Not implemented yet",
    []
  );
}

export function handleDisputeResolverUpdateAppliedEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: DisputeResolverUpdateApplied
): void {
  log.error(
    "handleDisputeResolverUpdateAppliedEvent() Not implemented yet",
    []
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
