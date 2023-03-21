import {
  ContractURIChanged,
  IBosonVoucher
} from "../../generated/BosonAccountHandler/IBosonVoucher";
import { Seller } from "../../generated/schema";

export function handleContractURIChanged(event: ContractURIChanged): void {
  const newContractURI = event.params.contractURI;

  const bosonVoucherContract = IBosonVoucher.bind(event.address);
  const sellerId = bosonVoucherContract.getSellerId().toString();
  let seller = Seller.load(sellerId);
  if (!seller) {
    seller = new Seller(sellerId);
  }
  seller.contractURI = newContractURI;
  seller.save();
}
