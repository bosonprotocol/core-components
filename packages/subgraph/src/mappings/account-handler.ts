import {
  SellerCreated,
  SellerUpdated,
  BuyerCreated
} from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import { Seller, Buyer } from "../../generated/schema";

export function handleSellerCreatedEvent(event: SellerCreated): void {
  const sellerFromEvent = event.params.seller;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (seller === null) {
    seller = new Seller(sellerId);
    seller.operator = sellerFromEvent.operator;
    seller.admin = sellerFromEvent.admin;
    seller.clerk = sellerFromEvent.clerk;
    seller.treasury = sellerFromEvent.treasury;
    seller.active = true;
    seller.save();
  }
}

export function handleSellerUpdatedEvent(event: SellerUpdated): void {
  const sellerFromEvent = event.params.seller;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (seller === null) {
    seller = new Seller(sellerId);
  }

  seller.operator = sellerFromEvent.operator;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.active = sellerFromEvent.active;
  seller.save();
}

export function handleBuyerCreatedEvent(event: BuyerCreated): void {
  const buyerFromEvent = event.params.buyer;
  const buyerId = buyerFromEvent.id.toString();

  let buyer = Buyer.load(buyerId);

  if (buyer === null) {
    buyer = new Buyer(buyerId);
  }

  buyer.wallet = buyerFromEvent.wallet;
  buyer.active = false;
  buyer.save();
}
