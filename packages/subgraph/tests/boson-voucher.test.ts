import { test, assert } from "matchstick-as/assembly/index";
import { createContractURIChanged, createVouchersPreMinted } from "./mocks";
import {
  handleContractURIChanged,
  handlePreMint
} from "../src/mappings/boson-voucher";
import { Address } from "@graphprotocol/graph-ts";

test("handle ContractURIChanged", () => {
  const voucherAddress = Address.fromString(
    "0x0123456789012345678901234567890123456789"
  );
  const contractURIChanged1 = createContractURIChanged(
    voucherAddress,
    "oriUri"
  );
  handleContractURIChanged(contractURIChanged1);
  assert.fieldEquals(
    "CollectionContract",
    voucherAddress.toString(),
    "address",
    "0x0123456789012345678901234567890123456789"
  );
  assert.fieldEquals(
    "CollectionContract",
    voucherAddress.toString(),
    "contractUri",
    "oriUri"
  );
  const contractURIChanged2 = createContractURIChanged(
    voucherAddress,
    "newUri"
  );
  handleContractURIChanged(contractURIChanged2);
  assert.fieldEquals(
    "CollectionContract",
    voucherAddress.toString(),
    "contractUri",
    "newUri"
  );
});

test("handle PreMintEvent", () => {
  const vouchersPreMinted = createVouchersPreMinted(1, 1, 1);
  handlePreMint(vouchersPreMinted);
  assert.fieldEquals("RangeEntity", "1-range", "minted", "1");
});
