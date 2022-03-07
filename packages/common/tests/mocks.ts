import { parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { CreateOfferArgs } from "../src/types";

export const IPFS_HASH = "QmYXc12ov6F2MZVZwPs5XeCBbf61cW3wKRk8h3D5NTYj4T";
export const IPFS_URI = `https://ipfs.io/ipfs/${IPFS_HASH}`;

export const ADDRESS = "0x57faFe1fB7C682216FCe44e50946C5249192b9D5";

export function mockCreateOfferArgs(
  overrides?: Partial<CreateOfferArgs>
): CreateOfferArgs {
  return {
    id: 1,
    price: parseEther("1"),
    deposit: parseEther("1"),
    penalty: parseEther("1"),
    quantity: 10,
    validFromDateInMS: Date.now(),
    validUntilDateInMS: Date.now() + 2 * 60 * 1000,
    redeemableDateInMS: Date.now() + 1 * 60 * 1000,
    fulfillmentPeriodDurationInMS: 60 * 60 * 1000,
    voucherValidDurationInMS: 60 * 60 * 1000,
    seller: ADDRESS,
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
    ...overrides
  };
}
