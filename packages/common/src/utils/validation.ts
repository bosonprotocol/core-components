import { object, string } from "yup";
import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";

export { validateMetadata } from "@bosonprotocol/metadata";

export const createOfferArgsSchema = object({
  price: string()
    .required()
    .test("is-valid-price", (value) => isPositiveBigNumber(value)),
  sellerDeposit: string()
    .required()
    .test("is-valid-deposit", (value) => isPositiveBigNumber(value)),
  buyerCancelPenalty: string()
    .required()
    .test("is-positive-number", (value) => isPositiveBigNumber(value))
    .test(
      "penalty-lte-price",
      "${path} has to be less than or equal price",
      (value, ctx) =>
        BigNumber.from(value).lte(BigNumber.from(ctx.parent.price))
    ),
  quantityAvailable: string()
    .required()
    .test("is-valid-quantity", (value) => isPositiveBigNumber(value)),
  validFromDateInMS: string()
    .required()
    .test("is-valid-from-date", (value, ctx) => {
      return (
        isPositiveBigNumber(value) &&
        BigNumber.from(value).gt(Date.now()) &&
        BigNumber.from(ctx.parent.validUntilDateInMS).gt(BigNumber.from(value))
      );
    }),
  validUntilDateInMS: string()
    .required()
    .test("is-valid-until-date", (value, ctx) => {
      return (
        isPositiveBigNumber(value) &&
        BigNumber.from(value).gt(Date.now()) &&
        BigNumber.from(ctx.parent.validFromDateInMS).lt(BigNumber.from(value))
      );
    }),
  redeemableFromDateInMS: string()
    .required()
    .test(
      "is-valid-redeemable-date",
      (value) =>
        isPositiveBigNumber(value) && BigNumber.from(value).gt(Date.now())
    ),
  fulfillmentPeriodDurationInMS: string()
    .required()
    .test("is-valid-fulfillment-period", (value) => isPositiveBigNumber(value)),
  voucherValidDurationInMS: string()
    .required()
    .test("is-valid-duration", (value) => isPositiveBigNumber(value)),
  exchangeToken: string()
    .required()
    .test("is-valid-exchange-token", (value) => isAddress(value || "")),
  metadataUri: string()
    .required()
    .test("is-valid-metadata-uri", (value) => isMetadataUri(value)), // TODO: validate if
  offerChecksum: string().required()
});

export const createSellerArgsSchema = object({
  operator: string()
    .required()
    .test("is-valid-address", (value) => isAddress(value || "")),
  admin: string()
    .required()
    .test("is-valid-address", (value) => isAddress(value || "")),
  clerk: string()
    .required()
    .test("is-valid-address", (value) => isAddress(value || "")),
  treasury: string()
    .required()
    .test("is-valid-address", (value) => isAddress(value || ""))
});

function isPositiveBigNumber(value: unknown) {
  try {
    const bigNumber = BigNumber.from(value);
    return !bigNumber.isNegative();
  } catch (error) {
    return false;
  }
}

function isMetadataUri(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  if (/^(ipfs|http|https):\/\/[^ "]+$/.test(value)) {
    return true;
  }

  // IPFS CID v0
  if (value.startsWith("Qm") && value.length === 46) {
    return true;
  }

  // TODO: IPFS CID v1

  return false;
}
