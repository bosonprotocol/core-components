import { Address } from "@graphprotocol/graph-ts";
import {
  ContractURIChanged,
  IBosonVoucher,
  Transfer
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

export function handlePreMint(event: Transfer): void {
  const { from, to, tokenId } = event.params;
  const isPreMint = from === Address.zero() && to !== Address.zero();
  if (!isPreMint) {
    return;
  }

  const bosonVoucherContract = IBosonVoucher.bind(event.address);
  const sellerId = bosonVoucherContract.getSellerId().toString();
  let seller = Seller.load(sellerId);
  if (!seller) {
    seller = new Seller(sellerId);
  }
  let rangeEntity = RangeEntity.load(rangeId);

  if (!rangeEntity) {
    rangeEntity = new RangeEntity(rangeId);
  }
  rangeEntity.start = event.params.startExchangeId;
  rangeEntity.end = event.params.endExchangeId;
  rangeEntity.owner = event.params.owner;
  rangeEntity.minted = 0;
  rangeEntity.save();
}
