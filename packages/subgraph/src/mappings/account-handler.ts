import {
  SellerCreated,
  SellerUpdated
} from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import { Seller } from "../../generated/schema";

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
