import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Seller } from "../../generated/schema";

export function saveSeller(sellerAddress: Address): void {
  let seller = Seller.load(sellerAddress.toHexString());

  if (seller === null) {
    seller = new Seller(sellerAddress.toHexString());
    seller.address = sellerAddress;
    seller.offerCount = BigInt.fromI32(1);
  } else {
    seller.offerCount = seller.offerCount.plus(BigInt.fromI32(1));
  }

  seller.save();
}
