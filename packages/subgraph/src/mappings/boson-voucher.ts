import { Address } from "@graphprotocol/graph-ts";
import {
  ContractURIChanged,
  IBosonVoucher,
  VouchersPreMinted
} from "../../generated/BosonAccountHandler/IBosonVoucher";
import { Offer, RangeEntity, Seller } from "../../generated/schema";
import { getRangeId } from "./offer-handler";

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

export function handlePreMint(event: VouchersPreMinted): void {
  const offerId = event.params.offerId;
  const startId = event.params.startId;
  const endId = event.params.endId;

  const offerIdStr = offerId.toString();
  const rangeId = getRangeId(offerIdStr);

  let rangeEntity = RangeEntity.load(rangeId);
  if (!rangeEntity) {
    rangeEntity = new RangeEntity(rangeId);
  }
  const preminted = endId.minus(startId);
  rangeEntity.minted = rangeEntity.minted.plus(preminted);
  rangeEntity.save();
}
