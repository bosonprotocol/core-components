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

export function handleSellerCreatedEvent(event: SellerCreated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
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
  }
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
}

export function handleDisputeResolverCreatedEvent(
  event: DisputeResolverCreated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
  getAndSaveDisputeResolverFees(disputeResolverId, event.address);
}

export function handleDisputeResolverUpdatedEvent(
  event: DisputeResolverUpdated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
}

export function handleDisputeResolverActivatedEvent(
  event: DisputeResolverActivated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
}

export function handleDisputeResolverFeesAddedEvent(
  event: DisputeResolverFeesAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);
}

export function handleDisputeResolverFeesRemovedEvent(
  event: DisputeResolverFeesRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);
}

export function handleAllowedSellersAddedEvent(
  event: AllowedSellersAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
}

export function handleAllowedSellersRemovedEvent(
  event: AllowedSellersRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
}
