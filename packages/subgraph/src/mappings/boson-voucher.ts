import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ContractURIChanged,
  VouchersPreMinted
} from "../../generated/BosonAccountHandler/IBosonVoucher";
import { CollectionContract, RangeEntity } from "../../generated/schema";
import { getRangeId } from "./offer-handler";

export function handleContractURIChanged(event: ContractURIChanged): void {
  const newContractURI = event.params.contractURI;
  const collectionContractId = event.address.toHexString();
  let collectionContract = CollectionContract.load(collectionContractId);
  if (!collectionContract) {
    collectionContract = new CollectionContract(collectionContractId);
    collectionContract.address = event.address;
  }
  collectionContract.contractUri = newContractURI;
  collectionContract.save();
}

export function handlePreMint(event: VouchersPreMinted): void {
  const offerId = event.params.offerId;
  const startId = event.params.startId;
  const endId = event.params.endId;

  const offerIdStr = offerId.toString();
  const rangeId = getRangeId(offerIdStr);

  let rangeEntity = RangeEntity.load(rangeId);
  if (!rangeEntity) {
    // Not really expected that the RangeEntity does not exists yet.
    // (may mean the VouchersPreMinted event is handled before the RangeReserved one)
    // In any case, make sure all the mandatory parameters are set
    rangeEntity = new RangeEntity(rangeId);
    rangeEntity.start = BigInt.fromI32(0);
    rangeEntity.end = BigInt.fromI32(0);
    rangeEntity.owner = Bytes.fromHexString("0x00");
    rangeEntity.minted = BigInt.zero();
  }
  // preminted = size of the interval [startID,endId]
  const preminted = endId.minus(startId).plus(BigInt.fromI32(1));
  rangeEntity.minted = rangeEntity.minted.plus(preminted);
  rangeEntity.save();
}
