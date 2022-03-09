import { parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import {
  IPFS_HASH,
  IPFS_URI,
  ADDRESS
} from "@bosonprotocol/common/tests/mocks";
import { CreateOfferArgs } from "../src/offers/types";

export function mockCreateOfferArgs(
  overrides?: Partial<CreateOfferArgs>
): CreateOfferArgs {
  return {
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
